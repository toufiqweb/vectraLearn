import Banner from "@/components/homepage/Banner";
import LearningTips from "@/components/homepage/LearningTips";
import NewReleases from "@/components/homepage/NewReleases";
import PopularCourses from "@/components/homepage/PopularCourses";
import StartLearningToday from "@/components/homepage/StartLearningToday";
import Stats from "@/components/homepage/Stats";
import TopInstructors from "@/components/homepage/TopInstructors";
import WhatOurStudentSay from "@/components/homepage/WhatOurStudentSay";
import NewReleasesLoading from "@/components/loadingpages/NewReleasesLoading";
import PopularCardLoading from "@/components/loadingpages/PopularCardLoading";
import { getAllCoursesData } from "@/lib/getAllCourses";
import { Suspense } from "react";
import LearningJourney from "@/components/homepage/LearningJourney";

export default async function Home() {
  const courses = await getAllCoursesData();

  return (
    <div >
      <Banner />
      <Stats />
      <Suspense fallback={<PopularCardLoading />}>
        <PopularCourses courses={courses} />
      </Suspense>
      <TopInstructors />
      <WhatOurStudentSay />
      <StartLearningToday />
      <Suspense fallback={<NewReleasesLoading />}>
        <NewReleases courses={courses}/>
      </Suspense>
      <LearningTips />
      <LearningJourney />
    </div>
  );
}
