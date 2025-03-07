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
import Spinner from '../miscellaneous/Spinner';

// Zod Schema for Validation
const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(4, 'Min length of 4'),
});

const Login = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGuestCredentials = () => {
    form.setValue('email', 'guest@example.com');
    form.setValue('password', 'Guest@1234');
  };

  // Submit Handler
  const onSubmit = async (formData) => {
    // console.log('Form Submitted:', formData);
    setLoading(true);
    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };
      const { data } = await axios.post(
        `/api/user/login`,
        formData,
        config,
      );
      toast({
        title: 'Success',
        description: 'Login Successful',
        variant: 'success', // Use your custom variant here
      });

      localStorage.setItem('user', JSON.stringify(data));
      navigate('/chat');
    } catch (error) {
      console.log(error);
      toast({
        description: error || 'Something went wrong!',
        variant: 'destructive',
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
                    type={show ? 'text' : 'password'}
                    placeholder="Enter the password"
                    {...field}
                  />
                  <Button
                    type="button"
                    className="absolute right-0  text-sm"
                    onClick={() => setShow(!show)}
                  >
                    {show ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-blue-400">
          {!loading ? (
            "Login"
          ) : (
            <>
              <Spinner />
              Loading...
            </>
          )}
        </Button>

        <Button
          type="button"
          className="w-full bg-red-400"
          onClick={handleGuestCredentials}
        >
          Get Guest User Credentials
        </Button>
      </form>
    </Form>
  );
};

export default Login;
