# Implementation Plan - Phase 3: Guest Valuation Linkage

This document outlines the detailed implementation plan for updating the appraisal submission endpoint (`/api/sell/route.ts`) to handle both authenticated and guest submissions, and configuring a database trigger to link guest submissions to user accounts upon signup.

---

## 1. 🚦 System Logic for Submission Endpoint

When a valuation is submitted through the Sell Form, the backend API (`/api/sell/route.ts`) must:
1. Identify if the request comes from an authenticated user (checking authorization header or cookies via Supabase client).
2. If **Authenticated**:
   *   Link the submission by storing the user's UUID in the `user_id` column of the `submissions` table.
   *   Save the contact fields as null or copy them from the profile.
3. If **Guest** (unauthenticated):
   *   Leave `user_id` as `NULL`.
   *   Save contact fields `guest_name`, `guest_email`, `guest_phone`, and `guest_postcode` from the form payload.
4. Insert calculation details into `submission_items` and uploaded image paths into `submission_images`.

---

## 2. ⚡ Database Trigger for Automatic Linkage

To ensure that guest users who later register with the same email can access their historical submissions, we will configure a Postgres trigger on profile creation:

```sql
CREATE OR REPLACE FUNCTION public.link_guest_submissions_on_signup()
RETURNS TRIGGER AS $$
BEGIN
    -- Update all existing submissions matching the new profile's email
    UPDATE public.submissions
    SET user_id = NEW.id
    WHERE (guest_email = NEW.email OR LOWER(guest_email) = LOWER(NEW.email))
      AND user_id IS NULL;
      
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created_link_submissions
    AFTER INSERT ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.link_guest_submissions_on_signup();
```

---

## 3. 🛠️ Implementation Steps

### Step 1: Update API Route `/api/sell/route.ts`
1. Retrieve request payload containing appraisal details, contact information, stamp items, and uploaded image paths.
2. Initialize Supabase Server Client to retrieve the current session.
3. Execute transaction:
   *   Insert record into `submissions`.
   *   Insert calculations breakdown array into `submission_items` (snapshotting the current rates and face values).
   *   Insert images array into `submission_images`.

### Step 2: Provision Postgres Trigger
1. Run migration or execute SQL to create the trigger function `link_guest_submissions_on_signup`.
2. Attach the trigger to the `profiles` table to execute `AFTER INSERT`.

---

## 🧪 Verification & Testing Plan

*   **Authenticated Submission Test**: Log in to a test account ➔ Submit an appraisal ➔ Verify `submissions` record is created with your `user_id` and the `profiles` role becomes `'seller'`.
*   **Guest Submission Test**: Log out ➔ Submit an appraisal with guest credentials ➔ Verify `submissions` record is created with `user_id = NULL` and correct guest email/details.
*   **Auto-Linkage Test**: Sign up a new user with the same email address used in the guest submission ➔ Verify the `submissions` record is updated and `user_id` is populated with the new user's UUID.
*   **Rate Lock Check**: When submitting, check that `submission_items` snapshot the rate (`rate_at_submission`) from `stamp_categories` and calculate the values correctly, protecting them from future catalog rate updates.
