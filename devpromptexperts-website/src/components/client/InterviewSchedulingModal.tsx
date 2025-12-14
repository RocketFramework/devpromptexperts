import { Fragment, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { HiX, HiCalendar, HiLink, HiLockClosed } from 'react-icons/hi';
import { ProposalInterviewsInsert } from '@/services/generated';

export type InterviewData = Pick<ProposalInterviewsInsert, 'title' | 'description' | 'start_time' | 'end_time' | 'meeting_platform' | 'meeting_url' | 'meeting_id' | 'meeting_password'>;

interface InterviewSchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (data: InterviewData) => Promise<void>;
  consultantName: string;
}

export default function InterviewSchedulingModal({
  isOpen,
  onClose,
  onSchedule,
  consultantName,
}: InterviewSchedulingModalProps) {
  const [formData, setFormData] = useState<InterviewData>({
    title: `Interview with ${consultantName}`,
    description: '',
    start_time: '',
    end_time: '',
    meeting_platform: 'Google Meet',
    meeting_url: '',
    meeting_id: '',
    meeting_password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'start_time') {
      // Auto-set end time to 30 mins later
      const startDate = new Date(value);
      const endDate = new Date(startDate.getTime() + 30 * 60000);
      
      // Format to datetime-local string (YYYY-MM-DDTHH:mm)
      // Note: This simple formatting works for local time if the input is local
      // But datetime-local inputs work with local time strings directly
      
      // We need to handle the timezone offset manually or use a library, 
      // but for a simple input value copy, we can just use the date methods carefully
      // or just rely on the fact that the input value is just a string.
      
      // Let's do it robustly:
      // The value from input is like "2023-10-27T10:00"
      // We can just parse it, add 30 mins, and format it back.
      
      const year = endDate.getFullYear();
      const month = String(endDate.getMonth() + 1).padStart(2, '0');
      const day = String(endDate.getDate()).padStart(2, '0');
      const hours = String(endDate.getHours()).padStart(2, '0');
      const minutes = String(endDate.getMinutes()).padStart(2, '0');
      
      const endTimeString = `${year}-${month}-${day}T${hours}:${minutes}`;
      
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        end_time: endTimeString
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.start_time || !formData.end_time) return;

    try {
      setIsSubmitting(true);
      await onSchedule(formData);
      onClose();
      // Reset form
      setFormData({
        title: `Interview with ${consultantName}`,
        description: '',
        start_time: '',
        end_time: '',
        meeting_platform: 'Google Meet',
        meeting_url: '',
        meeting_id: '',
        meeting_password: ''
      });
    } catch (error) {
      console.error('Error scheduling interview:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <HiX className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 sm:mx-0 sm:h-10 sm:w-10">
                    <HiCalendar className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                      Schedule Interview
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Set up a meeting with {consultantName}.
                      </p>
                      
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Meeting Title
                          </label>
                          <input
                            type="text"
                            name="title"
                            id="title"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={formData.title}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Start Time
                            </label>
                            <input
                              type="datetime-local"
                              name="start_time"
                              id="start_time"
                              required
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              value={formData.start_time}
                              onChange={handleChange}
                            />
                          </div>
                          <div>
                            <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              End Time
                            </label>
                            <input
                              type="datetime-local"
                              name="end_time"
                              id="end_time"
                              required
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              value={formData.end_time}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="meeting_platform" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Platform
                          </label>
                          <select
                            name="meeting_platform"
                            id="meeting_platform"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={formData.meeting_platform ?? ''}
                            onChange={handleChange}
                          >
                            <option value="Google Meet">Google Meet</option>
                            <option value="Zoom">Zoom</option>
                            <option value="Teams">Microsoft Teams</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="meeting_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Meeting URL
                          </label>
                          <div className="relative mt-1 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <HiLink className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                              type="url"
                              name="meeting_url"
                              id="meeting_url"
                              className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              placeholder="https://meet.google.com/..."
                              value={formData.meeting_url ?? ''}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="meeting_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Meeting ID (Optional)
                            </label>
                            <input
                              type="text"
                              name="meeting_id"
                              id="meeting_id"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              value={formData.meeting_id ?? ''}
                              onChange={handleChange}
                            />
                          </div>
                          <div>
                            <label htmlFor="meeting_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Password (Optional)
                            </label>
                            <div className="relative mt-1 rounded-md shadow-sm">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <HiLockClosed className="h-5 w-5 text-gray-400" aria-hidden="true" />
                              </div>
                              <input
                                type="text"
                                name="meeting_password"
                                id="meeting_password"
                                className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={formData.meeting_password ?? ''}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Additional Notes
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={formData.description ?? ''}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? 'Scheduling...' : 'Schedule Interview'}
                          </button>
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto"
                            onClick={onClose}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
