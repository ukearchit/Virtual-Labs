import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
}

interface QuizProps {
  questions: Question[];
}

export function Quiz({ questions }: QuizProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (questionId: number, optionId: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const score = Object.keys(answers).reduce((acc, qId) => {
    const q = questions.find(q => q.id === Number(qId));
    if (q && q.correctAnswer === answers[Number(qId)]) {
      return acc + 1;
    }
    return acc;
  }, 0);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {questions.map((q, idx) => (
        <Card key={q.id}>
          <CardHeader>
            <CardTitle className="text-lg">
              {idx + 1}. {q.text}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {q.options.map(opt => {
              const isSelected = answers[q.id] === opt.id;
              const isCorrect = q.correctAnswer === opt.id;
              
              let btnClass = "w-full justify-start text-left font-normal h-auto py-3 px-4";
              if (submitted) {
                if (isCorrect) {
                  btnClass += " bg-green-100 text-green-900 border-green-500 hover:bg-green-100";
                } else if (isSelected && !isCorrect) {
                  btnClass += " bg-red-100 text-red-900 border-red-500 hover:bg-red-100";
                }
              } else if (isSelected) {
                btnClass += " bg-primary/10 border-primary";
              }

              return (
                <Button
                  key={opt.id}
                  variant="outline"
                  className={btnClass}
                  onClick={() => handleSelect(q.id, opt.id)}
                  disabled={submitted}
                >
                  <div className="flex items-center gap-3 w-full">
                    <span className="font-medium w-6">{opt.id.toUpperCase()}.</span>
                    <span className="flex-1 whitespace-normal">{opt.text}</span>
                    {submitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />}
                    {submitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
                  </div>
                </Button>
              );
            })}
          </CardContent>
        </Card>
      ))}

      {!submitted ? (
        <Button 
          onClick={handleSubmit} 
          disabled={Object.keys(answers).length !== questions.length}
          className="w-full sm:w-auto"
        >
          Submit Answers
        </Button>
      ) : (
        <Alert className={score === questions.length ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"}>
          <AlertDescription className="text-lg font-medium flex items-center gap-2">
            {score === questions.length ? <CheckCircle2 className="text-green-600" /> : null}
            You scored {score} out of {questions.length}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
