import { useTranslation } from '../../hooks/useTranslation';

export const Translate = ({ text }: { text: string }) => {
  const translated = useTranslation(text);
  // Using dangerouslySetInnerHTML because Cloud Translate might return HTML entities (e.g. &#39;)
  return <span dangerouslySetInnerHTML={{ __html: translated }} />;
};
