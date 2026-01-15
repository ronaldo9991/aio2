import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/lib/authStore';
import { login } from '@/lib/api';
import { BrowserFrame } from '@/components/BrowserFrame';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { setAuth } = useAuthStore();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const result = await login(data.email, data.password);
      
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: result.error,
        });
        return;
      }

      if (result.data) {
        setAuth(result.data.user, result.data.token);
        toast({
          title: 'Welcome back!',
          description: `Logged in as ${result.data.user.email}`,
        });
        setLocation('/app/dashboard');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background noise-overlay">
      <div className="absolute inset-0 gradient-ocean opacity-50" />
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <BrowserFrame url="aquaintel.ai/login">
          <div className="p-8 glass">
            <div className="text-center mb-8">
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4 ocean-glow-sm"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2, type: 'spring' }}
              >
                <Lock className="w-8 h-8 text-primary" />
              </motion.div>
              <h1 className="text-2xl font-bold mb-1">Welcome Back</h1>
              <p className="text-sm text-muted-foreground">Sign in to AQUAINTEL</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@aquaintel.com"
                    className="pl-10 bg-background/50 border-border/50 focus:border-primary/50"
                    {...register('email')}
                    data-testid="input-email"
                  />
                </div>
                {errors.email && (
                  <motion.p 
                    className="text-xs text-destructive flex items-center gap-1"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertCircle className="w-3 h-3" />
                    {errors.email.message}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 bg-background/50 border-border/50 focus:border-primary/50"
                    {...register('password')}
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <motion.p 
                    className="text-xs text-destructive flex items-center gap-1"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertCircle className="w-3 h-3" />
                    {errors.password.message}
                  </motion.p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full ocean-glow"
                disabled={isLoading}
                data-testid="button-submit-login"
              >
                {isLoading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border/50">
              <div className="text-center text-sm text-muted-foreground">
                <p>Demo credentials:</p>
                <p className="font-mono text-xs mt-1">admin@aquaintel.com / admin123</p>
              </div>
            </div>
          </div>
        </BrowserFrame>
      </motion.div>
    </div>
  );
}
