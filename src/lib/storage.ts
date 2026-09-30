import { supabase, isSupabaseConfigured } from './supabase';

export type StorageBucket = 'hero-images' | 'destination-images' | 'attraction-images' | 'user-uploads';

export const getPublicStorageUrl = (bucket: StorageBucket, path: string): string => {
  if (!isSupabaseConfigured()) {
    return path.startsWith('http') ? path : `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80`;
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

export const uploadUserImage = async (file: File): Promise<{ url: string | null; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    // Provide an immediate local object URL for preview demo
    const localUrl = URL.createObjectURL(file);
    return { url: localUrl, error: null };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('user-uploads')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('user-uploads').getPublicUrl(filePath);
    return { url: data.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err.message || 'Image upload failed' };
  }
};
