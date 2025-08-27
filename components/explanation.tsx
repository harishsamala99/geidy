import React, { useState } from 'react';
import type { SmsExplanation } from '../services/types';


interface ExplanationProps {
  data: SmsExplanation;
}

const NumberIcon: React.FC<{ number: number }> = ({ number }) => (
    <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
      {number}
    </div>
);

const FolderIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
    </svg>
);

const FileIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
        <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
    </svg>
);

const CopyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
    </svg>
);
  
const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 6 9 17l-5-5"/></svg>
);


const Explanation: React.FC<ExplanationProps> = ({ data }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(data.codeSnippet.code).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }
    };
  
    return (
        <div className="bg-white p-8 rounded-lg shadow-lg border border-slate-200 space-y-12">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">{data.title}</h2>
                <p className="text-slate-600 text-lg leading-relaxed">{data.introduction}</p>
            </div>
        
            <div className="space-y-8">
                {data.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                    <NumberIcon number={index + 1} />
                    <div>
                    <h3 className="text-xl font-semibold text-slate-800">{step.stepTitle}</h3>
                    <p className="text-slate-600 mt-1 leading-relaxed">{step.stepDescription}</p>
                    </div>
                </div>
                ))}
            </div>

            {data.fileTree && data.fileTree.length > 0 && (
                <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-4">Project Folder Structure</h3>
                    <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm text-slate-700 space-y-2 border border-slate-200">
                        {data.fileTree.map((item, index) => (
                            <div key={index} className="flex items-center" style={{ paddingLeft: `${item.level * 24}px` }}>
                                {item.type === 'folder' ? 
                                    <FolderIcon className="w-5 h-5 mr-3 text-sky-600 flex-shrink-0" /> : 
                                    <FileIcon className="w-5 h-5 mr-3 text-slate-500 flex-shrink-0" />
                                }
                                <span>{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-1">{data.codeSnippet.description}</h3>
                <div className="mt-4 relative bg-slate-900 rounded-lg shadow-lg">
                <button 
                    onClick={handleCopy}
                    className="absolute top-3 right-3 p-1.5 rounded-md bg-slate-700 hover:bg-slate-600 transition text-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-white"
                    aria-label="Copy code"
                >
                    {copied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5" />}
                </button>
                <pre className="p-4 pt-12 overflow-x-auto text-sm text-slate-200 leading-relaxed">
                    <code className={`language-${data.codeSnippet.language}`}>
                    {data.codeSnippet.code}
                    </code>
                </pre>
                </div>
            </div>
            
            <div>
                <h3 className="text-xl font-semibold text-slate-800">Next Steps</h3>
                <p className="text-slate-600 mt-2 leading-relaxed">{data.conclusion}</p>
            </div>
        </div>
    );
};

export default Explanation;
