import React from 'react';
import { useForm as useRHForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  time: z.string().optional(),
  location: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  maxAttendees: z.number().int().positive("Must be a positive number"),
  bannerImageUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
  initialValues?: Partial<EventFormValues>;
  onSubmit: (data: EventFormValues) => void;
  isLoading: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({ initialValues, onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useRHForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      date: initialValues?.date ? new Date(initialValues.date).toISOString().split('T')[0] : '',
      time: initialValues?.time || '',
      location: initialValues?.location || '',
      category: initialValues?.category || 'Music',
      maxAttendees: initialValues?.maxAttendees || 100,
      bannerImageUrl: initialValues?.bannerImageUrl || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-white">
      <div>
        <label className="block text-sm text-gray-500 mb-1.5 font-medium">Title</label>
        <input 
          {...register("title")} 
          className="w-full bg-transparent border border-[#333] rounded-[8px] p-2.5 outline-none focus:border-[#9b51e0] transition-colors text-sm" 
          placeholder="Event title"
        />
        {errors.title && <span className="text-red-500 text-xs mt-1 block">{errors.title.message}</span>}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-500 mb-1.5 font-medium">Date</label>
          <input 
            type="date" 
            {...register("date")} 
            className="w-full bg-transparent border border-[#333] rounded-[8px] p-2.5 outline-none focus:border-[#9b51e0] transition-colors text-sm [color-scheme:dark]" 
          />
          {errors.date && <span className="text-red-500 text-xs mt-1 block">{errors.date.message}</span>}
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1.5 font-medium">Time slot</label>
          <input 
            type="time" 
            {...register("time")} 
            className="w-full bg-transparent border border-[#333] rounded-[8px] p-2.5 outline-none focus:border-[#9b51e0] transition-colors text-sm [color-scheme:dark]" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-500 mb-1.5 font-medium">Zone / Location</label>
          <input 
            {...register("location")} 
            className="w-full bg-transparent border border-[#333] rounded-[8px] p-2.5 outline-none focus:border-[#9b51e0] transition-colors text-sm" 
            placeholder="Main Hall"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1.5 font-medium">Category</label>
          <select 
            {...register("category")} 
            className="w-full bg-transparent border border-[#333] rounded-[8px] p-2.5 outline-none focus:border-[#9b51e0] transition-colors text-sm"
          >
            {['Music', 'Art', 'Tech', 'Comedy', 'Food', 'Business', 'Other'].map(c => (
              <option key={c} value={c} className="bg-[#242424]">{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-500 mb-1.5 font-medium">Capacity</label>
          <input 
            type="number" 
            {...register("maxAttendees", { valueAsNumber: true })} 
            className="w-full bg-transparent border border-[#333] rounded-[8px] p-2.5 outline-none focus:border-[#9b51e0] transition-colors text-sm" 
          />
          {errors.maxAttendees && <span className="text-red-500 text-xs mt-1 block">{errors.maxAttendees.message}</span>}
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1.5 font-medium">Banner Image URL</label>
          <input 
            type="url" 
            {...register("bannerImageUrl")} 
            className="w-full bg-transparent border border-[#333] rounded-[8px] p-2.5 outline-none focus:border-[#9b51e0] transition-colors text-sm" 
            placeholder="https://..."
          />
          {errors.bannerImageUrl && <span className="text-red-500 text-xs mt-1 block">{errors.bannerImageUrl.message}</span>}
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-500 mb-1.5 font-medium">Description</label>
        <textarea 
          {...register("description")} 
          rows={3} 
          className="w-full bg-transparent border border-[#333] rounded-[8px] p-2.5 outline-none focus:border-[#9b51e0] transition-colors text-sm resize-none" 
          placeholder="Event details..."
        />
      </div>

      <div className="pt-6 flex justify-end gap-3 items-center border-t border-[#333] mt-2">
        <button
          type="button"
          onClick={() => {
            const closeBtn = document.querySelector('button[aria-label="Close"]') || document.querySelector('.lucide-x')?.parentElement;
            if (closeBtn) (closeBtn as HTMLButtonElement).click();
          }}
          className="text-sm font-medium text-white hover:text-gray-300 px-4 py-2 transition-colors"
        >
          Discard
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#b573f0] hover:bg-[#a662e0] text-black px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 text-sm"
        >
          {isLoading ? 'Saving...' : 'Confirm'}
        </button>
      </div>
    </form>
  );
};
