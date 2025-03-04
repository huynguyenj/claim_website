import axios from "axios";
import { useEffect, useState } from "react";
type GithubType = {
      login:string,
      avatar_url:string
    }
    
export default function useCallApiGithub() {
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
  return {contributors}
}
