import React, { useState, useCallback, useEffect } from 'react';
import type { Chat } from '@google/genai';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ChatView from './components/ChatView';
import LoadingSpinner from './components/LoadingSpinner';
import { createChat, validateHealthDocument } from './services/geminiService';
import type { ChatMessage } from './types';
import { SparklesIcon } from './components/icons';
import { fileToBase64 } from './utils/fileUtils';
import Tabs from './components/Tabs';
import AboutPage from './components/AboutPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import ConsultationPage from './components/ConsultationPage';
import CompatibilityChecker from './components/CompatibilityChecker';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatting, setIsChatting] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const [activeTab, setActiveTab] = useState('analysis');
  const [loadingMessage, setLoadingMessage] = useState('분석 중...');

  useEffect(() => {
    setChat(createChat());
  }, []);

  const handleImageChange = useCallback((file: File) => {
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
  }, []);

  const handleStartAnalysis = async () => {
    if (!imageFile || !chat) {
      setError('분석할 건강 데이터 이미지를 먼저 업로드해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      setLoadingMessage('이미지 유효성 검사 중...');
      const base64Data = await fileToBase64(imageFile);
      const isValid = await validateHealthDocument(base64Data, imageFile.type);

      if (!isValid) {
        setError('올바른 건강검진 결과지 또는 인바디 검사지가 아닙니다. 다른 이미지를 업로드해주세요.');
        setIsLoading(false);
        setImageFile(null);
        setPreviewUrl(null);
        return;
      }
      
      setLoadingMessage('데이터 분석 중...');
      setIsChatting(true);

      const userMessage: ChatMessage = { role: 'user', text: "제 건강 데이터입니다. 분석해주세요." };
      setMessages([userMessage, { role: 'bot', text: '' }]); // Add bot placeholder immediately
      
      const imagePart = { inlineData: { mimeType: imageFile.type, data: base64Data } };
      const textPart = { text: "이 건강 데이터 이미지를 분석해주세요. 만약 추가 정보가 필요하다면, 질문을 통해 얻을 수 있다고 가정하고 분석을 진행해주세요." };
      
      const stream = await chat.sendMessageStream({ message: [textPart, imagePart] });

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        if (typeof chunkText === 'string') {
            setMessages(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage && lastMessage.role === 'bot') {
                    const updatedLastMessage = { ...lastMessage, text: lastMessage.text + chunkText };
                    return [...prev.slice(0, -1), updatedLastMessage];
                }
                return prev;
            });
        }
      }

    } catch (err) {
      console.error(err);
      setError('분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setMessages(prev => prev.slice(0, 1)); // Remove bot placeholder
      setIsChatting(false);
    } finally {
      setIsLoading(false);
      setLoadingMessage('분석 중...');
    }
  };
  
  const handleSendMessage = async (text: string) => {
    if (!chat || !text.trim()) return;

    const userMessage: ChatMessage = { role: 'user', text: text };
    setMessages(prev => [...prev, userMessage, { role: 'bot', text: '' }]);
    setIsLoading(true);

    try {
        const stream = await chat.sendMessageStream({ message: text });
        
        for await (const chunk of stream) {
            const chunkText = chunk.text;
            if(typeof chunkText === 'string') {
                setMessages(prev => {
                    const lastMessage = prev[prev.length - 1];
                    if (lastMessage && lastMessage.role === 'bot') {
                        const updatedLastMessage = { ...lastMessage, text: lastMessage.text + chunkText };
                        return [...prev.slice(0, -1), updatedLastMessage];
                    }
                    return prev;
                });
            }
        }
    } catch (err) {
        console.error(err);
        const errorMessage: ChatMessage = { role: 'bot', text: "죄송합니다, 답변을 생성하는 중 오류가 발생했습니다." };
        setMessages(prev => {
            const newMessages = [...prev];
            if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'bot') {
              newMessages[newMessages.length - 1] = errorMessage;
            } else {
              newMessages.push(errorMessage);
            }
            return newMessages;
        });
    } finally {
        setIsLoading(false);
    }
  }

  const renderActiveTab = () => {
    switch (activeTab) {
        case 'analysis':
            return isChatting ? (
                <ChatView messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} />
            ) : (
                <div className="bg-white dark:bg-slate-900/50 shadow-lg rounded-2xl p-6 md:p-8 border border-slate-200/50 dark:border-slate-800 mt-6">
                    <ImageUploader 
                        onImageUpload={handleImageChange} 
                        previewUrl={previewUrl}
                        title="건강 데이터 이미지 업로드"
                        description="인바디 또는 건강검진 결과지를 드래그 앤 드롭하거나 여기를 클릭하세요."
                    />
                    
                    <div className="mt-8 text-center">
                        <button
                            onClick={handleStartAnalysis}
                            disabled={!imageFile || isLoading}
                            className="inline-flex items-center justify-center px-8 py-4 bg-teal-600 text-white font-bold rounded-full text-lg shadow-lg hover:bg-teal-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-300 dark:focus:ring-teal-800"
                        >
                            {isLoading ? (
                                <><LoadingSpinner /><span>{loadingMessage}</span></>
                            ) : (
                                <><SparklesIcon className="w-6 h-6 mr-2" /><span>바디코드 분석 시작하기</span></>
                            )}
                        </button>
                    </div>
                </div>
            );
        case 'compatibility':
            return <CompatibilityChecker />;
        case 'about':
            return <AboutPage />;
        case 'privacy':
            return <PrivacyPolicyPage />;
        case 'consultation':
            return <ConsultationPage />;
        default:
            return null;
    }
  }


  return (
    <div className="min-h-screen font-sans flex flex-col">
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-4xl flex-grow flex flex-col">
        <Header />
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {renderActiveTab()}

        {error && !isChatting && activeTab === 'analysis' && (
          <div className="mt-8 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
            <p className="font-bold">오류</p>
            <p>{error}</p>
          </div>
        )}
      </main>
      <footer className="text-center py-6 text-sm text-slate-500 dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} 바디코드. All rights reserved.</p>
        <div className="mt-2 flex justify-center gap-4">
          <button onClick={() => setActiveTab('about')} className="hover:underline">바디코드 소개</button>
          <button onClick={() => setActiveTab('privacy')} className="hover:underline">개인정보처리방침</button>
          <button onClick={() => setActiveTab('consultation')} className="hover:underline">1:1 상담 신청</button>
        </div>
        <p className="mt-2 font-semibold">이 분석은 정보 제공 목적으로, 의학적 진단을 대체할 수 없습니다. 정확한 진단은 전문가와 상의하세요.</p>
      </footer>
    </div>
  );
};

export default App;