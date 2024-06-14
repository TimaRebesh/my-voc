import Image from 'next/image';

export const Preloader = ({ isLoading = true }: { isLoading?: boolean }) => {
  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-white bg-opacity-50 z-50 ${isLoading ? 'block' : 'hidden'}`}
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Image
          priority={true}
          src="/icons/loader.svg"
          alt="Loading..."
          width={50}
          height={50}
        />
      </div>
    </div>
  );
};
