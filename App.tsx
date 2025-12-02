

import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { ImageViewer } from './components/ImageViewer';
import { ImageUploader } from './components/ImageUploader';
import { HistoryPanel } from './components/HistoryPanel';
import { SettingsBar } from './components/SettingsBar';
import { ModeSelector } from './components/ModeSelector';
import { generatePortrait, editPortrait } from './services/geminiService';
import { fileToBase64 } from './utils/imageUtils';
import type { PromptOptions, Lang, Theme, Mode, HistoryItem, UploadedImage } from './types';
import { CONTROL_GROUPS } from './constants';

const App: React.FC = () => {
  const [lang, setLang] = useState<Lang>('zh');
  const [theme, setTheme] = useState<Theme>('light');
  const [mode, setMode] = useState<Mode>('text-to-image');
  const [isHistoryVisible, setIsHistoryVisible] = useState(true);
  
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [promptOptions, setPromptOptions] = useState<PromptOptions>({});
  
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleOptionsChange = useCallback((newOptions: PromptOptions) => {
    setPromptOptions(newOptions);
  }, []);

  const handleClearOptions = useCallback(() => {
    setPromptOptions({});
  }, []);

  const handleImageChange = useCallback(async (file: File | null) => {
    if (file) {
      try {
        const { base64, mimeType } = await fileToBase64(file);
        const objectUrl = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
          setUploadedImage({ 
            base64, 
            mimeType, 
            url: objectUrl,
            width: img.width,
            height: img.height,
          });
          // URL.revokeObjectURL(objectUrl) should be called on cleanup
        };
        img.src = objectUrl;
        setGeneratedImageUrl(null); // Clear previous generation
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to process image.');
      }
    } else {
      setUploadedImage(null);
    }
  }, []);
  
  const handleModeChange = useCallback((newMode: Mode) => {
    setMode(newMode);
    setError(null);
    setGeneratedImageUrl(null);
    setUploadedImage(null);
    setPromptOptions({});
  }, []);

  const handleGenerateOrEdit = async () => {
    setIsLoading(true);
    setError(null);
    if (mode === 'text-to-image') {
        setGeneratedImageUrl(null);
    }

    const buildPrompt = () => {
        const getOptionLabel = (id: string) => {
            const value = promptOptions[id];
            if (!value) return '';
            const allControls = CONTROL_GROUPS.flatMap(g => g.controls);
            const category = allControls.find(c => c.id === id);
            if (!category) return '';
            const option = category.options.find(o => o.value === value);
            // Always use English for the prompt itself
            return option?.label['en'] || '';
        };

        const selectedOptionsByGroup: Record<string, string[]> = {};
        CONTROL_GROUPS.forEach(group => {
            const groupName = group.name.en;
            selectedOptionsByGroup[groupName] = [];
            group.controls.forEach(cat => {
                const label = getOptionLabel(cat.id);
                if (label) {
                    selectedOptionsByGroup[groupName].push(`${cat.name.en}: ${label}`);
                }
            });
        });

        const qualityEnhancers = "8k, UHD, hyper-detailed, photorealistic, professional photography, sharp focus, high quality.";

        if (mode === 'image-to-image') {
            const changesList = Object.entries(selectedOptionsByGroup)
                .filter(([, options]) => options.length > 0)
                .map(([groupName, options]) => {
                    const optionsText = options.map(opt => `- ${opt}`).join('\n');
                    return `**${groupName} Changes:**\n${optionsText}`;
                })
                .join('\n\n');

            if (!changesList) {
                return "You are an expert medical illustrator. Your task is to enhance the clarity and scientific accuracy of this medical sketch/image. Preserve the original anatomical structure but make it look like a professional textbook illustration. Clean white background.";
            }
      
            return `You are an expert medical illustrator. Your task is to edit the provided medical image/sketch.
It is crucial to preserve the fundamental anatomical structure.
Apply the following specific changes to the pathology or style:

${changesList}

Ensure the result is scientifically accurate and suitable for medical education.`;
        }
        
        // Text-to-Image Logic
        const system = getOptionLabel('system');
        const organ = getOptionLabel('organ');
        const subject = organ ? `${organ} (${system})` : (system || 'human anatomy');
        
        const view = getOptionLabel('view');
        const section = getOptionLabel('section');
        const magnification = getOptionLabel('magnification');
        
        let narrative = `Create a professional medical illustration of ${subject}.`;
        
        if (view) narrative += ` View: ${view}.`;
        if (section) narrative += ` Section: ${section}.`;
        if (magnification) narrative += ` Magnification: ${magnification}.`;

        const pathologyDetails = selectedOptionsByGroup['Pathology & Condition'] || [];
        if (pathologyDetails.length > 0) {
             narrative += `\n\n**Pathology & Condition:** ${pathologyDetails.join('; ')}.`;
        }

        const styleDetails = selectedOptionsByGroup['Art Style'] || [];
        if (styleDetails.length > 0) {
            narrative += `\n\n**Artistic Style:** ${styleDetails.join('; ')}.`;
        }
        
        // Add system prompt for consistency
        narrative += `\n\n**System Requirement:** Professional medical illustration, scientifically accurate, clean white background (unless specified otherwise), high resolution, educational purpose, detailed anatomy, textbook style.`;
        
        narrative += `\n\n**Final Quality:** ${qualityEnhancers}`;

        return narrative.replace(/\s\s+/g, ' ').trim();
    };

    try {
      const prompt = buildPrompt();
      let generatedImageBase64: string;

      if (mode === 'image-to-image' && uploadedImage) {
        generatedImageBase64 = await editPortrait(uploadedImage.base64, uploadedImage.mimeType, prompt);
      } else {
        generatedImageBase64 = await generatePortrait(prompt);
      }
      
      const finalImageUrl = `data:image/png;base64,${generatedImageBase64}`;
      setGeneratedImageUrl(finalImageUrl);

      // Add to history
      const newHistoryItem: HistoryItem = {
        id: Date.now(),
        imageUrl: finalImageUrl,
        options: promptOptions,
        mode,
        originalImageBase64: uploadedImage?.base64,
        originalImageMimeType: uploadedImage?.mimeType,
      };
      setHistory(prev => [newHistoryItem, ...prev]);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRestoreHistory = useCallback((item: HistoryItem) => {
    setMode(item.mode);
    setPromptOptions(item.options);
    setGeneratedImageUrl(item.imageUrl);

    if (item.mode === 'image-to-image' && item.originalImageBase64 && item.originalImageMimeType) {
        const dataUrl = `data:${item.originalImageMimeType};base64,${item.originalImageBase64}`;
        const img = new Image();
        img.onload = () => {
            setUploadedImage({
                url: dataUrl,
                base64: item.originalImageBase64!,
                mimeType: item.originalImageMimeType!,
                width: img.width,
                height: img.height,
            });
        };
        img.src = dataUrl;
    } else {
        setUploadedImage(null);
    }
  }, []);

  const hasSelectedOptions = Object.values(promptOptions).some(val => val !== '');
  const canGenerate = mode === 'text-to-image' ? hasSelectedOptions : !!uploadedImage;

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-screen-2xl mx-auto flex justify-between items-center mb-6">
        <Header lang={lang} />
        <SettingsBar 
          lang={lang} onLangChange={setLang} 
          theme={theme} onThemeChange={setTheme}
          isHistoryVisible={isHistoryVisible} onHistoryToggle={() => setIsHistoryVisible(v => !v)}
        />
      </header>
      <main className={`w-full max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow`}>
        
        {/* Left Column: Controls */}
        <div className="lg:col-span-3 w-full bg-white dark:bg-black rounded-xl p-4 sm:p-6 flex flex-col">
          <ModeSelector mode={mode} onModeChange={handleModeChange} lang={lang} />
          <div className="mt-4 flex-grow">
            <ControlPanel 
              options={promptOptions} 
              onOptionsChange={handleOptionsChange} 
              onClearOptions={handleClearOptions}
              lang={lang} 
            />
          </div>
          <button
            onClick={handleGenerateOrEdit}
            disabled={isLoading || !canGenerate}
            className="w-full mt-6 bg-pink-accent hover:bg-pink-accent/90 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading 
              ? (lang === 'en' ? 'Generating...' : '生成中...') 
              : `✨ ${lang === 'en' ? 'Generate' : '生成'}`
            }
          </button>
           {error && <p className="text-pink-accent/90 mt-4 text-center text-sm">{error}</p>}
        </div>

        {/* Middle Column: Viewer/Uploader */}
        <div className={`w-full flex-grow flex flex-col bg-white dark:bg-black rounded-xl p-4 sm:p-6 ${isHistoryVisible ? 'lg:col-span-6' : 'lg:col-span-9'}`}>
          {mode === 'image-to-image' && !uploadedImage ? (
            <ImageUploader onImageChange={handleImageChange} lang={lang} />
          ) : (
            <ImageViewer
              generatedImageUrl={generatedImageUrl}
              originalImageUrl={uploadedImage?.url ?? null}
              imageDimensions={uploadedImage ? { w: uploadedImage.width, h: uploadedImage.height } : null}
              isLoading={isLoading}
              mode={mode}
              lang={lang}
            />
          )}
        </div>

        {/* Right Column: History */}
        {isHistoryVisible && (
            <div className="lg:col-span-3 w-full bg-white dark:bg-black rounded-xl p-4 sm:p-6">
               <HistoryPanel history={history} onRestore={handleRestoreHistory} lang={lang} />
            </div>
        )}
      </main>
    </div>
  );
};

export default App;