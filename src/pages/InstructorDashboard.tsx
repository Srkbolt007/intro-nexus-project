import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { mockCourses, Course, InstructorApplication } from '@/lib/mockData';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { notifyEnrolledStudents } from '@/lib/notificationManager';

export default function InstructorDashboard() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isApproved, setIsApproved] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [applicationForm, setApplicationForm] = useState({
    reason: '',
    experience: '',
    expertise: '',
    qualifications: '',
    courseIdea: '',
  });
  
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    thumbnail: '',
    category: '',
    difficulty: 'beginner' as const,
    lessons: [{ title: '', description: '', vimeoUrl: '', duration: '' }],
  });

  const [editCourse, setEditCourse] = useState<{
    title: string;
    description: string;
    thumbnail: string;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    lessons: { title: string; description: string; vimeoUrl: string; duration: string }[];
  }>({
    title: '',
    description: '',
    thumbnail: '',
    category: '',
    difficulty: 'beginner',
    lessons: [{ title: '', description: '', vimeoUrl: '', duration: '' }],
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role === 'instructor') {
      const savedCourses = JSON.parse(localStorage.getItem('courses') || JSON.stringify(mockCourses));
      setCourses(savedCourses.filter((c: Course) => c.instructorId === user.id));
    }
  }, [user, navigate]);

  const handleApply = () => {
    if (!user) return;
    
    // Validate all fields
    const { reason, experience, expertise, qualifications, courseIdea } = applicationForm;
    
    if (!reason.trim() || !experience.trim() || !expertise.trim() || 
        !qualifications.trim() || !courseIdea.trim()) {
      toast({ 
        title: 'Error', 
        description: 'Please fill out all fields in the application form.',
        variant: 'destructive'
      });
      return;
    }

    const application: InstructorApplication = {
      id: Date.now().toString(),
      userId: user.id,
      reason: reason.trim(),
      experience: experience.trim(),
      expertise: expertise.trim(),
      qualifications: qualifications.trim(),
      courseIdea: courseIdea.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    applications.push(application);
    localStorage.setItem('applications', JSON.stringify(applications));

    // Update user to show they applied
    updateUser({ role: 'instructor' });

    toast({ title: 'Application submitted!', description: 'Wait for admin approval.' });
  };

  const handleCreateCourse = () => {
    if (!user || !isApproved) return;

    const course: Course = {
      id: Date.now().toString(),
      ...newCourse,
      instructorId: user.id,
      enrolledStudents: [],
      createdAt: new Date().toISOString(),
      lessons: newCourse.lessons
        .filter(l => l.title.trim() && l.vimeoUrl.trim())
        .map(l => ({ ...l, id: `${Date.now()}-${Math.random()}` })),
    };

    const allCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    allCourses.push(course);
    localStorage.setItem('courses', JSON.stringify(allCourses));
    setCourses([...courses, course]);
    
    setShowCreateDialog(false);
    setNewCourse({
      title: '',
      description: '',
      thumbnail: '',
      category: '',
      difficulty: 'beginner',
      lessons: [{ title: '', description: '', vimeoUrl: '', duration: '' }],
    });
    
    toast({ title: 'Course created successfully!' });
  };

  const addLesson = (isEdit: boolean = false) => {
    const newLesson = { title: '', description: '', vimeoUrl: '', duration: '' };
    if (isEdit) {
      setEditCourse({ ...editCourse, lessons: [...editCourse.lessons, newLesson] });
    } else {
      setNewCourse({ ...newCourse, lessons: [...newCourse.lessons, newLesson] });
    }
  };

  const removeLesson = (index: number, isEdit: boolean = false) => {
    if (isEdit) {
      setEditCourse({ 
        ...editCourse, 
        lessons: editCourse.lessons.filter((_, i) => i !== index) 
      });
    } else {
      setNewCourse({ 
        ...newCourse, 
        lessons: newCourse.lessons.filter((_, i) => i !== index) 
      });
    }
  };

  const updateLesson = (index: number, field: string, value: string, isEdit: boolean = false) => {
    if (isEdit) {
      const updatedLessons = [...editCourse.lessons];
      updatedLessons[index] = { ...updatedLessons[index], [field]: value };
      setEditCourse({ ...editCourse, lessons: updatedLessons });
    } else {
      const updatedLessons = [...newCourse.lessons];
      updatedLessons[index] = { ...updatedLessons[index], [field]: value };
      setNewCourse({ ...newCourse, lessons: updatedLessons });
    }
  };

  const handleEditClick = (course: Course) => {
    setEditingCourse(course);
    setEditCourse({
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail,
      category: course.category,
      difficulty: course.difficulty,
      lessons: course.lessons.length > 0 
        ? course.lessons.map(l => ({
            title: l.title, 
            description: l.description || '', 
            vimeoUrl: l.vimeoUrl, 
            duration: l.duration 
          }))
        : [{ title: '', description: '', vimeoUrl: '', duration: '' }],
    });
    setShowEditDialog(true);
  };

  const handleUpdateCourse = async () => {
    if (!editingCourse) return;

    const updatedCourse: Course = {
      ...editingCourse,
      ...editCourse,
      lessons: editCourse.lessons
        .filter(l => l.title.trim() && l.vimeoUrl.trim())
        .map((l, idx) => ({ 
          ...l, 
          id: editingCourse.lessons[idx]?.id || `${Date.now()}-${Math.random()}` 
        })),
    };

    const allCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    const updated = allCourses.map((c: Course) => 
      c.id === editingCourse.id ? updatedCourse : c
    );
    localStorage.setItem('courses', JSON.stringify(updated));
    setCourses(courses.map(c => c.id === editingCourse.id ? updatedCourse : c));
    
    // Notify enrolled students about the update
    await notifyEnrolledStudents(
      updatedCourse.id,
      updatedCourse.title,
      'course_update',
      `${updatedCourse.title} has been updated with new content!`
    );
    
    setShowEditDialog(false);
    setEditingCourse(null);
    toast({ title: 'Course updated successfully!' });
  };

  const handleDeleteCourse = () => {
    if (!editingCourse) return;

    const allCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    const updated = allCourses.filter((c: Course) => c.id !== editingCourse.id);
    localStorage.setItem('courses', JSON.stringify(updated));
    setCourses(courses.filter(c => c.id !== editingCourse.id));
    
    setShowEditDialog(false);
    setEditingCourse(null);
    toast({ title: 'Course deleted' });
  };

  if (!user) return null;

  if (user.role !== 'instructor' && user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Apply to Become an Instructor</CardTitle>
            <CardDescription>
              Please note: You cannot directly become an instructor. You must submit an application 
              that will be reviewed by our admin team. Once approved, you'll gain access to the 
              instructor dashboard to create and manage courses.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="reason">Why do you want to teach on LearnFlow? *</Label>
              <Textarea
                id="reason"
                placeholder="Share your passion for teaching and what motivates you..."
                value={applicationForm.reason}
                onChange={(e) => setApplicationForm({ ...applicationForm, reason: e.target.value })}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Teaching Experience *</Label>
              <Textarea
                id="experience"
                placeholder="Describe your teaching experience (years, institutions, formats)..."
                value={applicationForm.experience}
                onChange={(e) => setApplicationForm({ ...applicationForm, experience: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expertise">Area of Expertise *</Label>
              <Input
                id="expertise"
                placeholder="e.g., Web Development, Data Science, Digital Marketing..."
                value={applicationForm.expertise}
                onChange={(e) => setApplicationForm({ ...applicationForm, expertise: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualifications">Qualifications & Certifications *</Label>
              <Textarea
                id="qualifications"
                placeholder="List your relevant degrees, certifications, and professional achievements..."
                value={applicationForm.qualifications}
                onChange={(e) => setApplicationForm({ ...applicationForm, qualifications: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="courseIdea">First Course Idea *</Label>
              <Textarea
                id="courseIdea"
                placeholder="What course would you like to create first? Provide a brief description..."
                value={applicationForm.courseIdea}
                onChange={(e) => setApplicationForm({ ...applicationForm, courseIdea: e.target.value })}
                rows={3}
              />
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>What happens next?</strong><br />
                After submitting your application, our admin team will review your qualifications. 
                You'll be notified once a decision is made. If approved, you'll gain immediate 
                access to create and publish courses.
              </p>
            </div>

            <Button 
              onClick={handleApply} 
              className="w-full"
              disabled={!applicationForm.reason.trim() || !applicationForm.experience.trim() || 
                       !applicationForm.expertise.trim() || !applicationForm.qualifications.trim() || 
                       !applicationForm.courseIdea.trim()}
            >
              Submit Application for Review
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isApproved) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Application Pending</CardTitle>
            <CardDescription>Your instructor application is under review</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Thank you for applying! An admin will review your application soon.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Instructor Dashboard</h1>
          <p className="text-muted-foreground">Manage your courses</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
              <DialogDescription>Fill in the course details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Thumbnail URL</Label>
                <Input
                  value={newCourse.thumbnail}
                  onChange={(e) => setNewCourse({ ...newCourse, thumbnail: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select
                    value={newCourse.difficulty}
                    onValueChange={(v: any) => setNewCourse({ ...newCourse, difficulty: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Lessons</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => addLesson(false)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Lesson
                  </Button>
                </div>
                {newCourse.lessons.map((lesson, index) => (
                  <div key={index} className="space-y-2 p-4 border rounded-lg relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Lesson {index + 1}</span>
                      {newCourse.lessons.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLesson(index, false)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <Input
                      placeholder="Lesson Title"
                      value={lesson.title}
                      onChange={(e) => updateLesson(index, 'title', e.target.value, false)}
                    />
                    <Input
                      placeholder="Vimeo URL"
                      value={lesson.vimeoUrl}
                      onChange={(e) => updateLesson(index, 'vimeoUrl', e.target.value, false)}
                    />
                    <Input
                      placeholder="Duration (e.g., 15:30)"
                      value={lesson.duration}
                      onChange={(e) => updateLesson(index, 'duration', e.target.value, false)}
                    />
                  </div>
                ))}
              </div>

              <Button onClick={handleCreateCourse} className="w-full">
                Create Course
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Course</DialogTitle>
              <DialogDescription>Update your course details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={editCourse.title}
                  onChange={(e) => setEditCourse({ ...editCourse, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editCourse.description}
                  onChange={(e) => setEditCourse({ ...editCourse, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Thumbnail URL</Label>
                <Input
                  value={editCourse.thumbnail}
                  onChange={(e) => setEditCourse({ ...editCourse, thumbnail: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    value={editCourse.category}
                    onChange={(e) => setEditCourse({ ...editCourse, category: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select
                    value={editCourse.difficulty}
                    onValueChange={(v: any) => setEditCourse({ ...editCourse, difficulty: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Lessons</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => addLesson(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Lesson
                  </Button>
                </div>
                {editCourse.lessons.map((lesson, index) => (
                  <div key={index} className="space-y-2 p-4 border rounded-lg relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Lesson {index + 1}</span>
                      {editCourse.lessons.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLesson(index, true)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <Input
                      placeholder="Lesson Title"
                      value={lesson.title}
                      onChange={(e) => updateLesson(index, 'title', e.target.value, true)}
                    />
                    <Input
                      placeholder="Vimeo URL"
                      value={lesson.vimeoUrl}
                      onChange={(e) => updateLesson(index, 'vimeoUrl', e.target.value, true)}
                    />
                    <Input
                      placeholder="Duration (e.g., 15:30)"
                      value={lesson.duration}
                      onChange={(e) => updateLesson(index, 'duration', e.target.value, true)}
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleUpdateCourse} className="flex-1">
                  Update Course
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteCourse}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Course
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id}>
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <CardHeader>
              <CardTitle className="line-clamp-2">{course.title}</CardTitle>
              <CardDescription className="line-clamp-2">{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {course.enrolledStudents.length} students
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => handleEditClick(course)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit Course
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">You haven't created any courses yet.</p>
        </div>
      )}
    </div>
  );
}