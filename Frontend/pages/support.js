import { useForm } from 'react-hook-form';
import Style from '../styles/suport.module.css';
import { useMutation, gql } from '@apollo/client';

const CREATE_SUPPORT_TICKET = gql`
  mutation CreateRecipe($recipeInput: RecipeInput) {
    createRecipe(recipeInput: $recipeInput) {
      email
      subject
      description
      createdAt
    }
  }
`;

export default function Support() {
  const [createRecipe] = useMutation(CREATE_SUPPORT_TICKET);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // Call the createRecipe mutation and pass the input variables
      const response = await createRecipe({
        variables: {
          recipeInput: {
            email: data.email,
            subject: data.subject,
            description: data.description,
          },
        },
      });

      // Handle the response if needed
      alert('Form submitted successfully!');

      // Reset the form
      reset();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form
      style={{
        maxWidth: '500px',
        margin: '0 auto',
      }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1>Support form</h1>
      <div>
        <label className={Style.labelS}>Email</label>
        <input
          className={Style.input}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
        />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <div>
        <label className={Style.labelS}>Subject</label>
        <input
          className={Style.input}
          {...register('subject', {
            required: 'Subject is required',
            minLength: {
              value: 10,
              message: 'Minimum 10 characters',
            },
            pattern: {
              value: /^[A-Za-z]+$/,
              message: 'Only letters are allowed',
            },
          })}
        />
        {errors.subject && <p>{errors.subject.message}</p>}
      </div>
      <div>
        <label className={Style.labelS}>Description</label>
        <textarea
          className={Style.input2}
          {...register('description', {
            required: 'Description is required',
            minLength: {
              value: 50,
              message: 'Minimum 50 characters',
            },
            pattern: {
              value: /^[A-Za-z]+$/,
              message: 'Only letters are allowed',
            },
          })}
        />
        {errors.description && <p>{errors.description.message}</p>}
      </div>

      <button className={Style.Button} type="submit">
        Submit
      </button>
    </form>
  );
}
