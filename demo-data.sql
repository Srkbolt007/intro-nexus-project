-- ============================================
-- DEMO DATA POPULATION
-- ============================================
-- Run this AFTER creating the demo accounts in Supabase Auth
-- and running the setup_demo_accounts() function

-- ============================================
-- STEP 1: Create demo accounts in Supabase Dashboard
-- ============================================
-- Go to Authentication > Users > Add User and create:
-- 1. admin@learnflow.com (password: admin123)
-- 2. instructor@learnflow.com (password: instructor123)
-- 3. student@learnflow.com (password: student123)
--
-- Then run: select setup_demo_accounts();

-- ============================================
-- STEP 2: Insert Demo Courses
-- ============================================

-- Get instructor user ID
DO $$
DECLARE
  instructor_uuid uuid;
  student_uuid uuid;
  course1_id uuid;
  course2_id uuid;
  course3_id uuid;
  lesson1_1_id uuid;
  lesson1_2_id uuid;
  lesson2_1_id uuid;
  lesson3_1_id uuid;
BEGIN
  -- Get user IDs
  SELECT id INTO instructor_uuid FROM auth.users WHERE email = 'instructor@learnflow.com';
  SELECT id INTO student_uuid FROM auth.users WHERE email = 'student@learnflow.com';

  -- Exit if users don't exist
  IF instructor_uuid IS NULL OR student_uuid IS NULL THEN
    RAISE NOTICE 'Please create demo accounts first and run setup_demo_accounts()';
    RETURN;
  END IF;

  -- Insert Course 1: Introduction to Web Development
  INSERT INTO public.courses (title, description, instructor_id, instructor_name, category, level, duration, thumbnail, video_url)
  VALUES (
    'Introduction to Web Development',
    'Learn the fundamentals of HTML, CSS, and JavaScript in this comprehensive beginner course.',
    instructor_uuid,
    'Instructor User',
    'Web Development',
    'beginner',
    '36 mins',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    'https://vimeo.com/148751763'
  )
  RETURNING id INTO course1_id;

  -- Insert lessons for Course 1
  INSERT INTO public.lessons (course_id, title, description, video_url, duration, order_index)
  VALUES 
    (course1_id, 'Getting Started with HTML', 'Learn the basics of HTML structure and semantic markup', 'https://vimeo.com/148751763', '15:30', 1),
    (course1_id, 'CSS Fundamentals', 'Master styling with CSS', 'https://vimeo.com/148751763', '20:45', 2)
  RETURNING id INTO lesson1_1_id;

  -- Insert Course 2: Advanced React Patterns
  INSERT INTO public.courses (title, description, instructor_id, instructor_name, category, level, duration, thumbnail, video_url)
  VALUES (
    'Advanced React Patterns',
    'Deep dive into advanced React concepts, hooks, and performance optimization.',
    instructor_uuid,
    'Instructor User',
    'Frontend Development',
    'advanced',
    '25 mins',
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    'https://vimeo.com/148751763'
  )
  RETURNING id INTO course2_id;

  -- Insert lessons for Course 2
  INSERT INTO public.lessons (course_id, title, description, video_url, duration, order_index)
  VALUES 
    (course2_id, 'Custom Hooks Deep Dive', 'Learn to create powerful custom hooks', 'https://vimeo.com/148751763', '25:00', 1);

  -- Insert Course 3: Python for Data Science
  INSERT INTO public.courses (title, description, instructor_id, instructor_name, category, level, duration, thumbnail, video_url)
  VALUES (
    'Python for Data Science',
    'Master Python programming for data analysis and machine learning applications.',
    instructor_uuid,
    'Instructor User',
    'Data Science',
    'intermediate',
    '18 mins',
    'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800',
    'https://vimeo.com/148751763'
  )
  RETURNING id INTO course3_id;

  -- Insert lessons for Course 3
  INSERT INTO public.lessons (course_id, title, description, video_url, duration, order_index)
  VALUES 
    (course3_id, 'Python Basics', 'Introduction to Python syntax and data structures', 'https://vimeo.com/148751763', '18:30', 1);

  -- Enroll student in Course 1 and Course 3
  INSERT INTO public.course_enrollments (course_id, student_id)
  VALUES 
    (course1_id, student_uuid),
    (course3_id, student_uuid);

  -- Initialize progress for enrolled courses
  INSERT INTO public.course_progress (user_id, course_id, enrolled_at, last_accessed, total_time_spent, completion_percentage, learning_streak)
  VALUES 
    (student_uuid, course1_id, NOW(), NOW(), 0, 0, 1),
    (student_uuid, course3_id, NOW(), NOW(), 0, 0, 1);

  -- Get lesson IDs for progress initialization
  SELECT id INTO lesson1_1_id FROM public.lessons WHERE course_id = course1_id AND order_index = 1;
  SELECT id INTO lesson1_2_id FROM public.lessons WHERE course_id = course1_id AND order_index = 2;
  SELECT id INTO lesson3_1_id FROM public.lessons WHERE course_id = course3_id AND order_index = 1;

  -- Initialize lesson progress
  INSERT INTO public.lesson_progress (course_progress_id, lesson_id, completed, time_spent, video_watch_time, current_position)
  SELECT 
    cp.id,
    l.id,
    false,
    0,
    0,
    0
  FROM public.course_progress cp
  JOIN public.lessons l ON l.course_id = cp.course_id
  WHERE cp.user_id = student_uuid AND cp.course_id IN (course1_id, course3_id);

  RAISE NOTICE 'Demo data created successfully!';
  RAISE NOTICE 'Created 3 courses with lessons';
  RAISE NOTICE 'Enrolled student in 2 courses';
END $$;
