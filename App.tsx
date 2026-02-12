import React, { useState, useCallback, useEffect } from 'react';
import type { Chat } from '@google/genai';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ChatView from './components/ChatView';
import LoadingSpinner from './components/LoadingSpinner';
import { createChat } from './services/geminiService';
import type { ChatMessage } from './types';
import { SparklesIcon, UserIcon } from './components/icons';
import AdditionalInfoForm from './components/AdditionalInfoForm';
import { fileToBase64 } from './utils/fileUtils';
import Tabs from './components/Tabs';
import AboutPage from './components/AboutPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatting, setIsChatting] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const [activeTab, setActiveTab] = useState('analysis');

  // State for additional user info
  const [stress, setStress] = useState('보통');
  const [sleep, setSleep] = useState('보통');
  const [bowel, setBowel] = useState('규칙적');
  const [healthNotes, setHealthNotes] = useState('');

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
    setIsChatting(true);
    setError(null);

    const userMessage: ChatMessage = { role: 'user', text: "제 건강 데이터입니다. 분석해주세요." };
    setMessages([userMessage]);

    try {
      const base64Data = await fileToBase64(imageFile);
      const imagePart = { inlineData: { mimeType: imageFile.type, data: base64Data } };
      const additionalInfo = { stress, sleep, bowel, healthNotes };
      const textPart = {
        text: `
[분석 요청]
아래 추가 정보를 바탕으로 업로드된 건강 데이터(인바디 또는 건강검진 결과) 이미지를 종합적으로 분석해주세요.
- 스트레스 지수: ${additionalInfo.stress || '정보 없음'}
- 수면의 질: ${additionalInfo.sleep || '정보 없음'}
- 배변 활동 상태: ${additionalInfo.bowel || '정보 없음'}
- 기타 건강 정보: ${additionalInfo.healthNotes || '정보 없음'}
`
      };
      
      const stream = await chat.sendMessageStream({ message: { parts: [textPart, imagePart] } });

      let botResponse = '';
      setMessages(prev => [...prev, { role: 'bot', text: '' }]);

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        if (chunkText) {
            botResponse += chunkText;
            setMessages(prev => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = { role: 'bot', text: botResponse };
              return newMessages;
            });
        }
      }

    } catch (err) {
      console.error(err);
      setError('분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setMessages(prev => prev.slice(0, 1)); // Remove bot placeholder
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendMessage = async (text: string) => {
    if (!chat) return;

    const userMessage: ChatMessage = { role: 'user', text: text };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
        const stream = await chat.sendMessageStream({ message: text });
        
        let botResponse = '';
        setMessages(prev => [...prev, { role: 'bot', text: '' }]);

        for await (const chunk of stream) {
            const chunkText = chunk.text;
            if(chunkText) {
                botResponse += chunkText;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { role: 'bot', text: botResponse };
                    return newMessages;
                });
            }
        }
    } catch (err) {
        console.error(err);
        const errorMessage: ChatMessage = { role: 'bot', text: "죄송합니다, 답변을 생성하는 중 오류가 발생했습니다." };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  }


  return (
    <div className="min-h-screen font-sans flex flex-col">
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-4xl flex-grow flex flex-col">
        <Header />
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {activeTab === 'analysis' && (
          isChatting ? (
              <ChatView messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} />
          ) : (
            <>
              <div className="bg-white dark:bg-slate-900/50 shadow-lg rounded-2xl p-6 md:p-8 border border-slate-200/50 dark:border-slate-800 mt-6">
                <ImageUploader onImageUpload={handleImageChange} previewUrl={previewUrl} />
                
                <AdditionalInfoForm 
                  stress={stress}
                  setStress={setStress}
                  sleep={sleep}
                  setSleep={setSleep}
                  bowel={bowel}
                  setBowel={setBowel}
                  healthNotes={healthNotes}
                  setHealthNotes={setHealthNotes}
                />

                <div className="mt-8 text-center">
                  <button
                    onClick={handleStartAnalysis}
                    disabled={!imageFile || isLoading}
                    className="inline-flex items-center justify-center px-8 py-4 bg-teal-600 text-white font-bold rounded-full text-lg shadow-lg hover:bg-teal-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-300 dark:focus:ring-teal-800"
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner />
                        <span>분석 중...</span>
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-6 h-6 mr-2" />
                        <span>바디코드 분석 시작하기</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
               <div className="mt-12">
                  <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                      <div>
                          <h3 className="text-2xl font-bold">약사와의 1:1 VIP 밀착관리</h3>
                          <p className="mt-2 text-slate-300 max-w-lg">
                              심층 분석과 지속적인 건강 관리를 원하신다면, 전문 약사의 1:1 맞춤 상담을 신청하세요.
                          </p>
                      </div>
                      <form action="https://formspree.io/f/xykdkrbj" method="POST" className="flex-shrink-0">
                        <button 
                            type="submit"
                            className="inline-flex items-center justify-center px-6 py-3 bg-emerald-500 text-white font-bold rounded-full text-md shadow-lg hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-300 dark:focus:ring-emerald-700"
                        >
                            <UserIcon className="w-5 h-5 mr-2" />
                            약사 1:1 상담 신청하기
                        </button>
                      </form>
                  </div>
              </div>
            </>
          )
        )}
        {activeTab === 'about' && <AboutPage />}
        {activeTab === 'privacy' && <PrivacyPolicyPage />}

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
        </div>
        <p className="mt-2 font-semibold">이 분석은 정보 제공 목적으로, 의학적 진단을 대체할 수 없습니다. 정확한 진단은 전문가와 상의하세요.</p>
      </footer>
    </div>
  );
};

export default App;