import { Progress } from "~/components/ui/progress";
import { ScaryMeterRating } from "~/models/scary-meter-rating";

export interface ScaryMeterProps {
  rating: ScaryMeterRating;
  movieId: number;
}

const ScaryMeter = (props: ScaryMeterProps) => {
  const { rating, movieId } = props;
  const overallRating = (rating?.overallRating ?? 0) * 10;
  const creepyRating = (rating?.creepyRating ?? 0) * 10;
  const jumpScareRating = (rating?.jumpScareRating ?? 0) * 10;
  const goreRating = (rating?.goreRating ?? 0) * 10;
  console.log("ScaryMeter", {
    overallRating,
    creepyRating,
    jumpScareRating,
    goreRating,
  });
  return (
    <div className="grid gap-2 p-4 m-4 bg-slate-100 rounded-md">
      <div className="grid items-center justify-center">
        <a href={`https://scarymeter.com/movie/${movieId}`} target="_blank" className="text-2xl font-bold">
          <img
            src="/scary_meter_logo_official.png"
            alt="Scary Meter Logo"
            className="w-100 h-16"
          />
        </a>
      </div>
      <h5 className="text-sm text-neutral-600">Overall {overallRating}%</h5>
      <Progress
        indicatorClassName="bg-[#9BC53D]"
        value={overallRating ? overallRating : 0}
        getValueLabel={(value) => `Overall ${value}%`}
      />
      <h5 className="text-sm text-neutral-600">Creepy {creepyRating}%</h5>
      <Progress
        indicatorClassName="bg-[#5BC0EB]"
        value={creepyRating ? creepyRating : 0}
        getValueLabel={(value) => `Creepy ${value}%`}
      />
      <h5 className="text-sm text-neutral-600">Jump Scare {jumpScareRating}%</h5>
      <Progress
        indicatorClassName="bg-[#D138BF]"
        value={jumpScareRating ? jumpScareRating : 0}
        getValueLabel={(value) => `Jump Scare ${value}%`}
      />
      <h5 className="text-sm text-neutral-600">Gore {goreRating}%</h5>
      <Progress
        indicatorClassName="bg-[#e55934]"
        value={goreRating ? goreRating : 0}
        getValueLabel={(value) => `Gore ${value}%`}
      />
    </div>
  );
};

export default ScaryMeter;
