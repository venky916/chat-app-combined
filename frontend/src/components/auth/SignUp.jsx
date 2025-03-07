import React, { useState } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Zod Schema for Validation
const formSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(4, 'Min length of 4'),
  confirmPassword: z.string().min(4, 'Min length of 4'),
  photoUrl: z.string().url('Photo URL must be a valid URL'),
});

const SignUp = () => {
  // React Hook Form Setup
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      photoUrl: '',
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  // Handle File Selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    // form.setValue('photoUrl', file);

    setLoading(true);
    const maxSize = 2 * 1024 * 1024; // 2 MB
    if (file.size > maxSize) {
      toast({
        description: 'File size should not exceed 2 MB',
      });
      setLoading(false);
      return;
    }

    const supportedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (supportedTypes.includes(file.type)) {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'Chat-App');
      data.append('cloud_name', 'dqwc6qu4h');
      fetch('https://api.cloudinary.com/v1_1/dqwc6qu4h/image/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          form.setValue('photoUrl', data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        description: 'Please Select an Image!',
      });
      setLoading(false);
      return;
    }
  };

  // Submit Handler
  const onSubmit = async (formData) => {
    // console.log('Form Submitted:', formData);
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        description: 'Passwords did not match',
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      const { data } = await axios.post(
        `/api/user/register`,
        formData,
        config,
      );
      toast({
        description: 'Registration Successful',
      });

      localStorage.setItem('user', JSON.stringify(data));
      navigate('/chat');
    } catch (error) {
      console.log(error);
      toast({
        description: error || 'Something went wrong!',
        status: 'error',
      });
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-md mx-auto"
      >
        {/* Name Field */}
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email Address <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Password <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative flex justify-between items-center">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter the password"
                    {...field}
                  />
                  <Button
                    type="button"
                    className="absolute right-0 text-sm"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Confirm Password <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative flex justify-between items-center">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Enter the password"
                    {...field}
                  />
                  <Button
                    type="button"
                    className="absolute right-0 text-sm"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="photoUrl"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload your Picture</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Choose File"
                  onChange={handleFileChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full bg-blue-400" disabled={loading}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default SignUp;
