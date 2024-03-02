import Image from 'next/image';
import { useTheme } from 'next-themes';

import Link from 'next/link';
import images from '../assets';
// eslint-disable-next-line import/no-cycle
import { Button } from '.';

const FooterLinks = ({ heading, items }) => (
  <div className="flex-1 justify-start items-start">
    <h3 className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl mb-10">
      {heading}
    </h3>
    {items.map((item, index) => (
      <p
        key={index}
        className="font-poppins dark:text-white text-nft-black-1 font-normal text-base cursor-pointer dark:hover:text-nft-gray-1 hover:text-nft-black1 my-3"
      >
        {item}
      </p>
    ))}
  </div>
);

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className="footer">
      {/* <div className="w-full minmd:w-4/5 flex flex-row md:flex-col sm:px-4 px-16"> */}
      {/* <div className="flexStart flex-1 flex-col">
          <Link href="/">
            <div className="flexCenter cursor-pointer">
              <Image
                src={images.log}
                objectFit="contain"
                width={32}
                height={32}
                alt="logo"
              />
              <p className="dark:text-white text-nft-black-1 font-semibold text-lg ml-1">
                Alphamint All Rights Reserverd.
              </p>
            </div>
          </Link>
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base mt-6">
           
          </p>
          <div className="flexBetween md:w-full minlg:w-557 w-357 mt-6 dark:bg-nft-black-2 bg-white border dark:border-nft-black-2 border-nft-gray-2 rounded-md">
            <input
              type="email"
              placeholder="Your Email"
              className="h-full flex-1 w-full dark:bg-nft-black-2 bg-white px-4 rounded-md dark:text-white text-nft-black-1 font-normal text-xs minlg:text-lg outline-none"
            />
            <div className="flex-initial">
              <Button btnName="Email me" classStyles="rounded-md" />
            </div>
          </div>
        </div> */}

      {/* <div className="flex-3 flexBetweenStart flex-wrap ml-10 md:ml-0 md:mt-8">
          <FooterLinks
            heading="Alphamint"
            items={['Explore', 'How it Works', 'Contact Us']}
            />
          
          {[images.twitter, images.telegram].map((image, index) => (
            <div className="mx-2 cursor-pointer" key={index}>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={image}
                  objectFit="contain"
                  width={24}
                  height={24}
                  alt="social"
                  className={theme === 'light' ? 'filter invert' : ''}
                />
              </a>
            </div>
          ))}
        </div> */}
      {/* </div> */}

      <div className="flexCenter w-full mt-5 border-t dark:border-nft-black-1 border-nft-gray-1 sm:px-4 px-16 footer">
        <div className="flexBetween flex-row w-full minmd:w-7/5 sm:flex-col mt-5">
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://layerzero.network/"
          >
            <div className="flexCenter cursor-pointer">
              {/* Powered by */}
              <Image
                src={images.layerzero}
                objectFit="contain"
                // width={40}
                // height={40}
                alt="logo"
              />
              {/* LayerZero. */}
              {/* <p className="dark:text-white text-nft-black-1 font-semibold text-lg ml-1">
                Powered by LayerZero.
              </p> */}
            </div>
          </a>
          <div>
            <Link href="/terms" target="_blank">
              Terms of Service
            </Link>

            <Link href="/support">/ Support</Link>
          </div>

          {/* <Link href="/termsOfService.pdf"> Terms of Service.</Link> */}
          <div className="flex flex-row sm:mt-4">
            {[images.twitter].map((image, index) => (
              <div className="mx-2 cursor-pointer" key={index}>
                <a
                  rel="noopener noreferrer"
                  href="https://twitter.com/beta_bridge"
                  target="_blank"
                >
                  <Image
                    src={image}
                    objectFit="contain"
                    width={24}
                    height={24}
                    alt="social"
                    className={theme === 'light' ? 'filter invert' : ''}
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
