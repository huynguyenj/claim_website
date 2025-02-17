import { useEffect, useState } from "react";
import OverviewCard from "../../components/OverviewCard";
import {
  AccessTimeFiledIcon,
  ArrowDownwardIcon,
  ArrowForwardIcon,
  AttachMoneyIcon,
  SummarizeIcon,
  UserIcon,
} from "../../components/Icon/MuiIIcon";
import axios from "axios";
import Footer from "../../layouts/Footer";

type ItemOverview = {
  title: string;
  image?: string;
  content: string;
};

const overViewData: ItemOverview[] = [
  {
    title: "Easy Overtime Submission",
    image:
      "https://www.chanty.com/blog/wp-content/uploads/2024/09/Working-Overtime.png",
    content: "Employees can log in, enter overtime details, and submit claims.",
  },
  {
    title: "Real-time Tracking",
    image:
      "https://www.dispatchtrack.com/hubfs/real%20time%20delivery%20tracking.webp",
    content: "Employees can check their claim status anytime.",
  },
  {
    title: "Approval Workflow",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE7s9fNlfbUKhq06ZIA42sMhPOv-a_v2tn5w&s",
    content: "Managers can approve, reject, or request additional details.",
  },
  {
    title: "Automated Records",
    image:
      "https://matomo.org/wp-content/uploads/2020/02/campaign-tracking-web-ready-1.png",
    content: "The system keeps track of all claims, reducing paperwork.",
  },
  {
    title: "Secure & Role-Based Access",
    image: "https://cdn-icons-png.flaticon.com/512/10108/10108414.png",
    content: "Ensures that only authorized personnel can manage claims.",
  },
];

type StepData = {
  icon: React.ComponentType<{ sx?: object }>;
  text: string;
};

const steps: StepData[] = [
  { icon: UserIcon, text: "Person work OT" },
  { icon: SummarizeIcon, text: "Make claim form" },
  { icon: AccessTimeFiledIcon, text: "Wait for approval" },
  { icon: AttachMoneyIcon, text: "Receive money OT" },
];

type GithubType = {
  login:string,
  avatar_url:string
}

function OverView() {
  const [contributors,setContributors] = useState<GithubType[]>([]);

  useEffect(()=>{
    const getContributors = async()=>{
        try {
          const response = await axios.get(
            "https://api.github.com/repos/huynguyenj/claim_website/contributors"
          );
          setContributors(response.data);
          console.log(contributors)
        } catch (error) {
          console.log('error can not get data',error)
        }
    }
    getContributors();
  },[])
  useEffect(() => {
    console.log(window.innerHeight);
    const title = document.getElementById("title");
    console.log(title?.getBoundingClientRect());
  }, []);
  return (
    <div className="text-white relative">
      <div id="title" className="p-5">
        <p className="text-[1.2rem] text-gray-500 uppercase mt-5 mb-2 text-center">
          Introduction
        </p>
        <h1 className="text-4xl sm:text-6xl font-bold text-center">Overview</h1>
        <p className="mt-2 text-gray-500 text-[1.1rem] text-center">
          In many companies, employees often work beyond their regular hours to
          meet deadlines or handle urgent tasks. Managing overtime claims
          manually can be inefficient, leading to delays, errors, and a lack of
          transparency.Our Overtime Claim Management System provides an
          easy-to-use platform where employees can submit, track, and manage
          their overtime requests, while managers and HR teams can efficiently
          review and approve them.
        </p>
      </div>
      <div className="relative">
        <h1 className="text-4xl sm:text-5xl m-auto mt-10 font-bold text-center rounded-4xl p-5">
          Feature
        </h1>
        <div className="sm:w-[80%] m-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-10 px-5">
          {overViewData.map((data, index) => (
            <OverviewCard
              key={index}
              title={data.title}
              image={data.image}
              content={data.content}
            />
          ))}
        </div>
      </div>
      <div>
        <h1 className="text-3xl sm:text-5xl text-center font-bold mt-15">How it work?</h1>
        <div className="flex sm:flex-row flex-col items-center gap-5 mt-10 justify-center">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-center gap-3 justify-center">
              <div className="flex flex-col items-center">
                <step.icon sx={{ fontSize: 100 }} />
                <p>{step.text}</p>
              </div>
              {index < steps.length - 1 && (
                <div>
                  <div className="hidden sm:block">
                    <ArrowForwardIcon sx={{ fontSize: 70 }} />
                  </div>
                  <div className="sm:hidden block">
                    <ArrowDownwardIcon sx={{ fontSize: 40 }} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h1 className="text-3xl sm:text-5xl font-bold text-center mt-15" >Contributors</h1>
        <div className="grid sm:grid-cols-4 mt-10 w-[70%] m-auto items-center justify-center bg-gray-800 rounded-2xl p-5">
          {contributors.length > 0 &&(contributors.map((contributor,index)=>(
            <div key={index} className="flex flex-col items-center gap-5 mt-5">
              <img className="w-15 h-15 sm:w-30 sm:h-30 rounded-full" src={contributor.avatar_url} alt="avatar"/>
              <p>{contributor.login}</p>
            </div>
          )))}
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default OverView;
