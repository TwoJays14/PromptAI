'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import Form from '@components/Form';
import { useRouter } from 'next/navigation';

const EditPrompt = () => {
  const searchParams = useSearchParams();
  const promptId = searchParams.get('id');
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState({
    prompt: '',
    tag: '',
  });

  useEffect(() => {
    const getPromptDetails = async () => {
      try {
        const response = await fetch(`/api/prompt/${promptId}`);

        if (response.ok) {
          const data = await response.json();
          console.log('Prompt details:', data);

          setPost({
            prompt: data.prompt,
            tag: data.tag,
          });
        } else {
          console.error('Error fetching prompt details:', response.statusText);
          // Log the full response for further inspection
          const responseData = await response.text();
          console.error('Response data:', responseData);
        }
      } catch (error) {
        console.error(
          'An error occurred while fetching prompt details:',
          error
        );
      }
    };

    if (promptId) {
      getPromptDetails();
    }
  }, [promptId]);

  const updatePrompt = async (e) => {
    e.preventDefault();

    setSubmitting(true); // can use as loader

    if (!promptId) {
      return alert('Prompt ID not found');
    }

    try {
      const response = await fetch(`/api/prompt/${promptId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: post.prompt,
          tag: post.tag,
        }),
      });

      if (response.ok) {
        router.push('/');
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form
      type="Edit"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={updatePrompt}
    />
  );
};

export default EditPrompt;
