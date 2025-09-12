/*
  # Create generate_affiliate_code function

  1. New Functions
    - `generate_affiliate_code()` - Generates unique affiliate codes for employees
    
  2. Security
    - Sets explicit search_path to prevent security issues
    - Uses SECURITY DEFINER for consistent execution context
    
  3. Functionality
    - Generates 8-character alphanumeric codes
    - Ensures uniqueness by checking existing codes
    - Automatically called when employee profiles are created
*/

-- Create the function to generate unique affiliate codes
CREATE OR REPLACE FUNCTION public.generate_affiliate_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_code TEXT;
    code_exists BOOLEAN;
BEGIN
    LOOP
        -- Generate a random 8-character alphanumeric code
        new_code := upper(
            substring(
                encode(gen_random_bytes(6), 'base64'),
                1, 8
            )
        );
        
        -- Replace any non-alphanumeric characters with random letters
        new_code := regexp_replace(new_code, '[^A-Z0-9]', chr(65 + floor(random() * 26)::int), 'g');
        
        -- Ensure it's exactly 8 characters
        new_code := substring(new_code, 1, 8);
        
        -- Check if this code already exists
        SELECT EXISTS(
            SELECT 1 FROM profiles WHERE affiliate_code = new_code
        ) INTO code_exists;
        
        -- If code doesn't exist, we can use it
        IF NOT code_exists THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN new_code;
END;
$$;

-- Create a trigger function to automatically assign affiliate codes to employees
CREATE OR REPLACE FUNCTION public.assign_affiliate_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Only assign affiliate code to employees who don't already have one
    IF NEW.role = 'employee' AND (NEW.affiliate_code IS NULL OR NEW.affiliate_code = '') THEN
        NEW.affiliate_code := generate_affiliate_code();
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger to automatically assign affiliate codes
DROP TRIGGER IF EXISTS trigger_assign_affiliate_code ON profiles;
CREATE TRIGGER trigger_assign_affiliate_code
    BEFORE INSERT OR UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION assign_affiliate_code();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION generate_affiliate_code() TO authenticated;
GRANT EXECUTE ON FUNCTION assign_affiliate_code() TO authenticated;