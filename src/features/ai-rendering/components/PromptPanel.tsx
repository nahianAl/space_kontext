'use client';

import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Sparkles } from 'lucide-react';
import { useRenderStore } from '../store/renderStore';
import type { ImageSize, OutputFormat } from '../types';

const IMAGE_SIZE_OPTIONS: { value: ImageSize; label: string }[] = [
  { value: '1:1', label: 'Square (1:1)' },
  { value: '16:9', label: 'Landscape (16:9)' },
  { value: '9:16', label: 'Portrait (9:16)' },
  { value: '4:3', label: 'Classic (4:3)' },
  { value: '3:4', label: 'Portrait (3:4)' },
  { value: '21:9', label: 'Ultrawide (21:9)' },
  { value: 'auto', label: 'Auto' },
];

const OUTPUT_FORMAT_OPTIONS: { value: OutputFormat; label: string }[] = [
  { value: 'png', label: 'PNG' },
  { value: 'jpeg', label: 'JPEG' },
];

export function PromptPanel() {
  const {
    prompt,
    imageSize,
    outputFormat,
    isGenerating,
    sourceImage,
    setPrompt,
    setImageSize,
    setOutputFormat,
    createJob,
  } = useRenderStore();

  const handleGenerate = async () => {
    try {
      await createJob();
    } catch (error) {
      console.error('Generation failed:', error);
      alert(error instanceof Error ? error.message : 'Generation failed');
    }
  };

  const isValid = prompt.trim().length > 0 && sourceImage !== null;

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold">Prompt & Specifications</h3>

      {/* Prompt Input */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">
          Prompt <span className="text-destructive">*</span>
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe how to transform your uploaded image... (e.g., 'Transform this building to sunset lighting with warm tones', 'Add photorealistic materials and shadows', 'Convert to watercolor architectural sketch')"
          className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          maxLength={5000}
          disabled={isGenerating}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {prompt.length} / 5000 characters
        </p>
      </div>

      {/* Specifications */}
      <div className="grid grid-cols-2 gap-4">
        {/* Aspect Ratio */}
        <div>
          <label className="mb-2 block text-sm font-medium">Aspect Ratio</label>
          <Select
            value={imageSize}
            onValueChange={(value) => setImageSize(value as ImageSize)}
            disabled={isGenerating}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {IMAGE_SIZE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Output Format */}
        <div>
          <label className="mb-2 block text-sm font-medium">Format</label>
          <Select
            value={outputFormat}
            onValueChange={(value) => setOutputFormat(value as OutputFormat)}
            disabled={isGenerating}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OUTPUT_FORMAT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={!isValid || isGenerating}
        className="mt-6 w-full"
        size="lg"
      >
        <Sparkles className="mr-2 h-5 w-5" />
        {isGenerating ? 'Processing...' : 'Edit Image with AI'}
      </Button>

      {!isValid && (
        <p className="mt-2 text-center text-xs text-destructive">
          {!sourceImage
            ? 'Please upload an image first'
            : 'Please enter a prompt to describe how to edit the image'}
        </p>
      )}
    </Card>
  );
}
