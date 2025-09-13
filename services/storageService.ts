import supabase from './supabase';

export interface UploadResult {
  url: string;
  path: string;
}

export const storageService = {
  /**
   * Upload a file to the letters bucket
   */
  async uploadFile(file: File, userId: string): Promise<UploadResult> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('letters')
      .upload(fileName, file);

    if (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('letters')
      .getPublicUrl(fileName);

    return {
      url: publicUrl,
      path: fileName
    };
  },

  /**
   * Delete a file from the letters bucket
   */
  async deleteFile(path: string): Promise<void> {
    const { error } = await supabase.storage
      .from('letters')
      .remove([path]);

    if (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  },

  /**
   * Get a signed URL for a private file
   */
  async getSignedUrl(path: string, expiresIn: number = 3600): Promise<string> {
    const { data, error } = await supabase.storage
      .from('letters')
      .createSignedUrl(path, expiresIn);

    if (error) {
      throw new Error(`Failed to create signed URL: ${error.message}`);
    }

    return data.signedUrl;
  }
};