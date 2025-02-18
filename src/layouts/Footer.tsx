import { AddressIcon, EmailIcon, PhoneIcon } from "../components/Icon/MuiIIcon";
import logoWebsite from "../assets/logowebsite.png";
function Footer() {
  return (
    <footer className="bg-gray-800 w-full h-fit bottom-0 mt-20 ">
      <div className=" w-full h-fit flex flex-col sm:flex-row gap-10 sm:gap-50 items-center justify-center sm:justify-between p-5">
        <div className="px-10 flex flex-col gap-2">
          <div className="flex items-center">
            <img
              className="w-30 h-30 rounded-full"
              src={logoWebsite}
              alt="logo"
            />
            <h1 className="text-[1.2rem] sm:text-4xl font-bold">Claim project</h1>
          </div>
          <p className="text-center sm:text-start">We are committed to providing a fast, reliable, and hassle-free claims process, ensuring you receive the support and resolution you need with complete transparency and security. </p>
        </div>
        <div className="sm:mr-10">
          <h1 className="text-3xl m-2 text-center sm:text-start">Supports</h1>
          <ul className="flex flex-col gap-1">
            <li className="flex gap-3">
              <EmailIcon /> <p>nguyenhuyjobs@gmail.com</p>
            </li>
            <li className="flex gap-3">
              <PhoneIcon />
              <p>09814487467</p>
            </li>
            <li className="flex gap-3">
              <AddressIcon />
              <p>
                G Floor, F-Town 1 Buiding, High-teach Park, Tan Phu Ward,
                District 9, Ho Chi Minh, Vietnam
              </p>
            </li>
          </ul>
        </div>
      </div>
      <p className="text-center mt-5 text-[0.9rem]">
        &copy; {new Date().getFullYear()} Copyright
      </p>
    </footer>
  );
}

export default Footer;

