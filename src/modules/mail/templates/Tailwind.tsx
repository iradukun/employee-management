import { Tailwind } from '@react-email/components';

export const TailwindWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: '#F56413',
              primary: '#F56413',
            },
          },
        },
      }}
    >
      {/* <Button href="https://example.com" className="bg-brand px-3 py-2 font-medium leading-4 text-white">
        Click me
      </Button> */}
      {children}
    </Tailwind>
  );
};
