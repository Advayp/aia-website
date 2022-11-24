import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import './Markdown.css';
import 'katex/dist/katex.min.css';

export default function Markdown({ children }) {
  return (
    <>
      <div className="main">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={rehypeKatex}
          children={children}
        />
      </div>
    </>
  );
}
