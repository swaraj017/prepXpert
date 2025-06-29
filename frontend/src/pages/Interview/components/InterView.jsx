import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { useMediaQuery } from 'react-responsive';

import SpinnerLoad from '../../../components/Loaders/SpinnerLoad';
import DashboardLayout from '../../Home/DashboardLayout';
import RoleInfoHeader from './RoleInfoHeader';
import QuestionCard from '../../../components/Cards/QuestionCard';
import ExplanationCard from '../../../components/Cards/ExplanationCard';
import { AnimatePresence, motion } from 'framer-motion';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATH } from '../../../utils/apiPath';

const Interview = () => {
  const { sessionId } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [selectedQuestionText, setSelectedQuestionText] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [updateLoader, setUpdateLoader] = useState(false);

  const isMobile = useMediaQuery({ maxWidth: 768 });

  const fetchSessionDetailsById = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATH.SESSION.GET_ONE(sessionId));
      if (response.data?.session) {
        setSessionData(response.data.session);
      } else {
        setErrorMsg('No session data found.');
      }
    } catch (error) {
      console.error('Error fetching session:', error);
      setErrorMsg('Failed to load session data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetailsById();
    }
  }, [sessionId]);

  const generateConceptExplanation = async (questionId, questionText) => {
    try {
      setSelectedQuestionId(questionId);
      setSelectedQuestionText(questionText);
      setUpdateLoader(true);
      const res = await axiosInstance.post(API_PATH.AI.GENERATE_EXPLANATION, {
        question: questionText,
      });
      setExplanation(res?.data?.explanation || 'No explanation found.');
    } catch (error) {
      console.error('  Explanation generation error:', error);
      setExplanation('Something went wrong while generating the explanation.');
    } finally {
      setUpdateLoader(false);
    }
  };

  const toggleQuestionPinStatus = async (questionId) => {
    try {
      setUpdateLoader(true);
      const res = await axiosInstance.patch(API_PATH.QUESTION.PIN(questionId));
      const updatedPinned = res?.data?.isPinned;

      setSessionData((prev) => ({
        ...prev,
        questions: prev.questions.map((q) =>
          q._id === questionId ? { ...q, isPinned: updatedPinned, _reorderDelay: true } : q
        ),
      }));

      setTimeout(() => {
        setSessionData((prev) => ({
          ...prev,
          questions: prev.questions.map((q) => {
            const { _reorderDelay, ...cleaned } = q;
            return cleaned;
          }),
        }));
      }, 300);
    } catch (err) {
      console.error('  Pin toggle failed:', err);
    } finally {
      setUpdateLoader(false);
    }
  };

  const loadMoreQuestions = async () => {
    if (!sessionData) return;
    try {
      setUpdateLoader(true);

      const genRes = await axiosInstance.post(API_PATH.AI.GENERATE_QUESTIONS, {
        role: sessionData.role,
        experience: sessionData.experience,
        topicsToFocus: sessionData.topicsToFocus,
        numberOfQues: 7,
      });

      const generated = genRes.data || [];

      const saveRes = await axiosInstance.post(API_PATH.QUESTION.ADD_TO_SESSION, {
        sessionId,
        questions: generated,
      });

      const savedQuestions = saveRes.data || [];

      setSessionData((prev) => ({
        ...prev,
        questions: [...prev.questions, ...savedQuestions],
      }));
    } catch (err) {
      console.error(' Failed to load and save more questions:', err);
    } finally {
      setUpdateLoader(false);
    }
  };

  return (
    <DashboardLayout>
      {isLoading ? (
        <SpinnerLoad />
      ) : errorMsg ? (
        <div className="text-red-600 font-semibold">{errorMsg}</div>
      ) : (
        <RoleInfoHeader
          role={sessionData?.role}
          topicsToFocus={sessionData?.topicsToFocus}
          experience={sessionData?.experience}
          questions={sessionData?.questions}
          description={sessionData?.description}
          lastUpdated={
            sessionData?.updatedAt
              ? moment(sessionData.updatedAt).format('MMMM Do, YYYY')
              : ''
          }
        />
      )}

      <div className="container mx-auto pt-4 pb-4 px-4 md:px-0">
        <h2 className="text-lg font-semibold text-black mb-4">Interview Q & A</h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Questions on Left */}
          <div className="md:col-span-7 flex flex-col gap-4">
            <AnimatePresence>
              {[...(sessionData?.questions || [])]
                .sort((a, b) => (a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1))
                .map((data, index) => {
                  const isActive = selectedQuestionId === data._id;
                  return !isMobile ? (
                    <motion.div
                      key={data._id || index}
                      layout
                      layoutId={`question-${data._id || index}`}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        duration: 0.4,
                        type: 'spring',
                        stiffness: 100,
                        delay: index * 0.1,
                        damping: 30,
                      }}
                      className="space-y-3"
                    >
                      <QuestionCard
                        question={data.question}
                        answer={data.answer}
                        isPinned={data.isPinned}
                        onLearnMore={() =>
                          generateConceptExplanation(data._id, data.question)
                        }
                        onTogglePin={() => toggleQuestionPinStatus(data._id)}
                      />
                    </motion.div>
                  ) : (
                    // FIXED: Mobile layout with proper spacing and container
                    <div key={data._id || index} className="relative">
                      {/* Question Card Container */}
                      <div className="mb-3">
                        <QuestionCard
                          question={data.question}
                          answer={data.answer}
                          isPinned={data.isPinned}
                          onLearnMore={() =>
                            generateConceptExplanation(data._id, data.question)
                          }
                          onTogglePin={() => toggleQuestionPinStatus(data._id)}
                        />
                      </div>
                      
                      {/* Explanation Card Container - Only shown for active question */}
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mb-4 relative z-10"
                        >
                          <ExplanationCard
                            question={selectedQuestionText}
                            explanation={explanation}
                            onClose={() => {
                              setSelectedQuestionId(null);
                              setExplanation('');
                            }}
                          />
                        </motion.div>
                      )}
                    </div>
                  );
                })}
            </AnimatePresence>

            {sessionData?.questions?.length > 0 && (
              <button
                onClick={loadMoreQuestions}
                disabled={updateLoader}
                className="mt-4 w-fit px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {updateLoader ? 'Loading...' : 'Load More Questions'}
              </button>
            )}
          </div>

          {/* Explanation Panel on Right (desktop only) */}
          {!isMobile && selectedQuestionId && (
            <div className="md:col-span-5 md:sticky md:top-20 h-fit">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.4 }}
              >
                <ExplanationCard
                  question={selectedQuestionText}
                  explanation={explanation}
                  onClose={() => {
                    setSelectedQuestionId(null);
                    setExplanation('');
                  }}
                />
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Interview;