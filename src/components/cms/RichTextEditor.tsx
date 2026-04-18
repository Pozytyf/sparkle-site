import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const modules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'blockquote'],
    ['clean'],
  ],
};

const formats = ['header', 'bold', 'italic', 'underline', 'list', 'bullet', 'link', 'blockquote'];

/**
 * Reusable rich-text editor for long-form CMS content.
 */
export const RichTextEditor = ({ value, onChange, className = '' }: RichTextEditorProps) => {
  return (
    <div className={`bg-background rounded-lg ${className}`}>
      <ReactQuill theme="snow" value={value} onChange={onChange} modules={modules} formats={formats} />
    </div>
  );
};

export default RichTextEditor;
