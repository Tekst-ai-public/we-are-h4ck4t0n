'use client';

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type LabelWithExamples = {
  label: string;
  examples: string[];
};

export default function Page() {
  const [prompt, setPrompt] = useState('');
  const [labels, setLabels] = useState<LabelWithExamples[]>([]);

  function addLabel() {
    setLabels((labels) => [...labels, { label: '', examples: [''] }]);
  }

  function handleDelete(index: number) {
    const temp = [...labels];
    temp.splice(index, 1);
    setLabels(temp);
  }

  function addExample(index: number) {
    const temp = [...labels];
    temp[index].examples.push('');
    setLabels(temp);
  }

  function deleteExample(labelIndex: number, exampleIndex: number) {
    const temp2 = [...labels[labelIndex].examples];
    temp2.splice(exampleIndex, 1);
    setLabels((labels) =>
      labels.map((item, index) => {
        if (index === labelIndex) {
          return {
            ...item,
            examples: temp2,
          };
        }
        return item;
      })
    );
  }

  async function saveSettings() {
    try {
      const res = await fetch('https://localhost:8000', {
        method: 'POST',
        body: JSON.stringify(labels),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(`Error saving settings: ${data}`);
      }

      toast.success('Saved');
    } catch (error) {
      console.log(error);
      toast.error('Saving failed');
    }
  }

  return (
    <div className="w-full h-full">
      <Card>
        <CardHeader>
          <CardTitle>Manage your models</CardTitle>
        </CardHeader>
        <CardContent className="px-10">
          <div className="w-full">
            <div className="mb-4">
              <p className="font-bold">Prooompt enhancement</p>
              <p className="text-slate-500">
                Enhance your prompt to better tailor the model predictions (optional)
              </p>
            </div>
            <div>
              <Textarea
                className="h-12"
                placeholder="proooooooomting ..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
          </div>
          <Separator className="my-4" />
          <div className="w-full">
            <div className="mb-4">
              <p className="font-bold">Labels and examples</p>
              <p className="text-slate-500">
                Provide the model with the labels and optional examples per label to predict
              </p>
            </div>
            {labels.map((label, index) => (
              <div className="flex gap-5 mb-3 border p-2 rounded-md bg-secondary/10" key={index}>
                <div>
                  <Input
                    className="w-80"
                    placeholder={`Label ${index + 1}`}
                    value={label.label}
                    onChange={(e) =>
                      setLabels((labels) =>
                        labels.map((item, i) => {
                          if (i === index) {
                            return {
                              label: e.target.value,
                              examples: label.examples,
                            };
                          }
                          return item;
                        })
                      )
                    }
                  />
                </div>
                <div className="w-full space-y-2">
                  {label.examples.map((example, i) => (
                    <div key={index + i} className="w-full">
                      <div className="w-full flex items-center">
                        <Input
                          className="w-full"
                          placeholder={`Example ${i + 1}`}
                          value={example}
                          onChange={(e) =>
                            setLabels((labels) =>
                              labels.map((item, itemIndex) => {
                                if (index === itemIndex) {
                                  return {
                                    label: item.label,
                                    examples: item.examples.map((example, exI) => {
                                      if (exI === i) {
                                        return e.target.value;
                                      }
                                      return example;
                                    }),
                                  };
                                }
                                return item;
                              })
                            )
                          }
                        />
                        <Button
                          variant="ghost"
                          className="hover:text-red-600"
                          onClick={() => deleteExample(index, i)}
                        >
                          Delete example
                        </Button>
                      </div>

                      {i === label.examples.length - 1 && (
                        <Button variant="ghost" onClick={() => addExample(index)}>
                          Add example
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  className="hover:text-red-600"
                  onClick={() => handleDelete(index)}
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            ))}
            <div>
              <Button variant="secondary" className="w-28" onClick={addLabel}>
                Add label
              </Button>
            </div>
          </div>
          <div className="mt-10 w-full flex grow justify-end">
            <Button variant="secondary" className="w-24" onClick={saveSettings}>
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
