import clsx from "clsx";
import { Spinner } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "~/components/ui/progress";
import { ConflictError } from "~/models/errors";
import { ScaryMeterRating } from "~/models/scary-meter-rating";

export interface ScaryMeterProps {
  movieId: number;
  scaryMeterRating?: ScaryMeterRating;
  className?: string;
}

const ScaryMeter = (props: ScaryMeterProps) => {
  const { movieId, scaryMeterRating, className } = props;


  const { isPending, isError, data: rating, error } = useQuery({
    queryKey: ["scarymetter", movieId, scaryMeterRating],
    queryFn: async () => {
      if (scaryMeterRating) {
        return scaryMeterRating;
      }
      const resp = await fetch(`/scary-meter-score/${movieId}`);
      if (resp.status === 409) {
        const { message } = await resp.json();
        throw new ConflictError(message);
      }
      const rating = await resp.json();
      return rating as ScaryMeterRating;
    },
    retry: (failureCount, error) => {
      if (error instanceof ConflictError) {
        return false;
      } else if (failureCount < 2) {
        return true;
      }
      return false;
    }
  });

  if (isPending) {
    return <Spinner />;
  }

  if (isError) {
    return <strong className="text-destructive">{error.message}</strong>;
  }

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
    <div className={clsx('grid gap-2 p-4 m-4 bg-slate-100 rounded-md w-[100%]', className)}>
      <div className="grid items-center justify-center">
        <a href={`https://scarymeter.com/movie/${movieId}`} target="_blank" rel="noreferrer" className="text-2xl font-bold">
          <img
            src="/scary_meter_logo_official.png"
            alt="Scary Meter Logo"
            className="w-100 h-16"
          />
        </a>
      </div>
      <h5 className="text-sm text-neutral-600">Overall {overallRating.toFixed(2)}%</h5>
      <Progress
        indicatorClassName="bg-[#9BC53D]"
        value={overallRating ? overallRating : 0}
        getValueLabel={(value) => `Overall ${value}%`}
      />
      <h5 className="text-sm text-neutral-600">Creepy {creepyRating.toFixed(2)}%</h5>
      <Progress
        indicatorClassName="bg-[#5BC0EB]"
        value={creepyRating ? creepyRating : 0}
        getValueLabel={(value) => `Creepy ${value}%`}
      />
      <h5 className="text-sm text-neutral-600">Jump Scare {jumpScareRating.toFixed(2)}%</h5>
      <Progress
        indicatorClassName="bg-[#D138BF]"
        value={jumpScareRating ? jumpScareRating : 0}
        getValueLabel={(value) => `Jump Scare ${value}%`}
      />
      <h5 className="text-sm text-neutral-600">Gore {goreRating.toFixed(2)}%</h5>
      <Progress
        indicatorClassName="bg-[#e55934]"
        value={goreRating ? goreRating : 0}
        getValueLabel={(value) => `Gore ${value}%`}
      />
    </div>
  );
};

export default ScaryMeter;
