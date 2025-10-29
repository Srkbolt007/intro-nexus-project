import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Award, CheckCircle, TrendingUp, Globe, FileText, UserCheck, Rocket, Clock } from 'lucide-react';
import { mockCourses, mockUsers } from '@/lib/mockData';
import { useEffect, useState } from 'react';
import { getAvatarColor } from '@/lib/avatarColors';
export default function Home() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState(mockCourses);
  useEffect(() => {
    const saved = localStorage.getItem('courses');
    if (saved) {
      setCourses(JSON.parse(saved));
    } else {
      localStorage.setItem('courses', JSON.stringify(mockCourses));
    }
  }, []);
  const featuredCourses = courses.slice(0, 3);
  return <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative py-24 md:py-36 px-4 overflow-hidden">
        <div className="absolute inset-0 hero-gradient"></div>
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" style={{
        animationDelay: '2s'
      }}></div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-in fade-in slide-in-from-bottom duration-700">
            <Rocket className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Launch Your Learning Journey Today</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 animate-in fade-in slide-in-from-bottom duration-700 leading-tight">
            LearnFlow — Where <span className="text-gradient">Knowledge</span> Moves Freely
          </h1>
          
          <p className="text-xl md:text-2xl mb-10 text-muted-foreground max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom duration-700 delay-150 leading-relaxed">
            Join our community of learners and educators. Access quality courses, share knowledge, and grow together in a vibrant learning ecosystem.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            <Button size="lg" variant="glow" onClick={() => navigate('/courses')} className="group">
              Browse Courses
              <BookOpen className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/signup')}>
              Get Started Free
            </Button>
          </div>
          
          {/* Stats */}
          
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-fade-in">
            <Card className="text-center border-0 card-glass hover-lift group">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl educational-gradient text-white mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-10 w-10" />
                </div>
                <CardTitle className="text-2xl mb-3">Quality Content</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Learn from expert instructors through carefully crafted video lessons designed for maximum impact
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 card-glass hover-lift group">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl secondary-gradient text-white mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-10 w-10" />
                </div>
                <CardTitle className="text-2xl mb-3">Community Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Join discussions, share insights, and learn together in a supportive environment
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 card-glass hover-lift group">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-accent/70 text-white mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Award className="h-10 w-10" />
                </div>
                <CardTitle className="text-2xl mb-3">Open Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Access all courses freely and expand your knowledge without any barriers
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      

      {/* How to Become an Instructor */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How to Become an Instructor</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Share your expertise with learners worldwide. Our simple application process ensures we maintain high-quality instruction on the platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 stagger-fade-in">
            <Card className="text-center hover-lift border-0 card-glass group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
              <CardHeader>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl educational-gradient text-white mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <FileText className="h-8 w-8" />
                </div>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold mb-2">1</div>
                <CardTitle className="text-xl">Submit Application</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Fill out our comprehensive application form with your teaching experience, qualifications, and course ideas.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover-lift border-0 card-glass group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl"></div>
              <CardHeader>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl secondary-gradient text-white mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <UserCheck className="h-8 w-8" />
                </div>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-foreground text-sm font-bold mb-2">2</div>
                <CardTitle className="text-xl">Admin Review</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Our team reviews your application to ensure you meet our quality standards and teaching requirements.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover-lift border-0 card-glass group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl"></div>
              <CardHeader>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/70 text-white mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <Rocket className="h-8 w-8" />
                </div>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm font-bold mb-2">3</div>
                <CardTitle className="text-xl">Start Teaching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Once approved, create and publish your courses immediately. Start impacting learners around the world!
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="relative overflow-hidden rounded-2xl p-10 text-center card-glass border-2 border-primary/20">
            <div className="absolute inset-0 educational-gradient opacity-5"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-display font-bold mb-4">Ready to Share Your Knowledge?</h3>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">Note: You cannot directly become an instructor. You should apply to become an instructor at signup as instructor.</p>
              <Button size="lg" variant="glow" onClick={() => navigate('/signup')}>
                Apply to Become a Student
                <Rocket className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Teach on LearnFlow */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Why Teach on LearnFlow?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Join thousands of instructors making a difference</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto stagger-fade-in">
            <Card className="hover-lift border-0 card-glass group">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl educational-gradient text-white mb-4 group-hover:scale-110 transition-transform">
                  <Globe className="h-7 w-7" />
                </div>
                <CardTitle className="text-xl">Global Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Connect with students from around the world and make a lasting impact on their learning journey.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift border-0 card-glass group">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl secondary-gradient text-white mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-7 w-7" />
                </div>
                <CardTitle className="text-xl">Grow Your Influence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Build your reputation as an expert in your field and expand your professional network.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift border-0 card-glass group">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-accent/70 text-white mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-7 w-7" />
                </div>
                <CardTitle className="text-xl">Supportive Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Join a community of passionate educators who support each other in delivering quality education.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift border-0 card-glass group">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl educational-gradient text-white mb-4 group-hover:scale-110 transition-transform">
                  <Award className="h-7 w-7" />
                </div>
                <CardTitle className="text-xl">Quality Focused</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  We maintain high standards to ensure all courses provide genuine value to learners.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift border-0 card-glass group">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl secondary-gradient text-white mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-7 w-7" />
                </div>
                <CardTitle className="text-xl">Full Control</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Manage your courses, update content, and interact with students all from your instructor dashboard.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Featured Courses</h2>
            <p className="text-lg text-muted-foreground">Discover our most popular learning experiences</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-fade-in">
            {featuredCourses.map((course, index) => {
            const instructor = mockUsers.find(u => u.id === course.instructorId);
            const avatarColor = instructor ? getAvatarColor(instructor.name) : '';
            return <Card key={course.id} className="group cursor-pointer border-0 card-glass hover-lift overflow-hidden" onClick={() => navigate(`/course/${course.id}`)}>
                  <div className="relative overflow-hidden">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-52 object-cover smooth-transition group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-background/95 backdrop-blur-md shadow-lg border-0">
                        <Clock className="h-3 w-3 mr-1" />
                        {course.lessons.length} lessons
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader className="space-y-4 pb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-background shadow-md" style={{
                    backgroundColor: avatarColor
                  }}>
                        <AvatarFallback className="text-white font-semibold">
                          {instructor?.name[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <CardDescription className="text-sm font-medium truncate">{instructor?.name}</CardDescription>
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2 group-hover:text-primary smooth-transition text-xl leading-snug">
                      {course.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-3 pt-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs font-medium border-primary/30">
                        {course.category}
                      </Badge>
                      <Badge variant="secondary" className={`text-xs capitalize font-medium ${course.difficulty === 'beginner' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' : course.difficulty === 'intermediate' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30' : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'} border`}>
                        {course.difficulty}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>;
          })}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" variant="secondary" onClick={() => navigate('/courses')} className="group">
              View All Courses
              <BookOpen className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      
    </div>;
}