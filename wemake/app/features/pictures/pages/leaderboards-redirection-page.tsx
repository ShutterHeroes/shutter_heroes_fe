import { data, redirect } from "react-router";
import { DateTime } from "luxon";

export function loader({ params }: { params: { period: string } }) {
  const { period } = params;
  let url: string;
  const today = DateTime.now().setZone("Asia/Seoul");
  if (period === "daily") {
    url = `/pictures/leaderboards/daily/${today.year}/${today.month}/${today.day}`;
  } else if (period === "weekly") {
    url = `/pictures/leaderboards/weekly/${today.year}/${today.weekNumber}`;
  } else if (period === "monthly") {
    url = `/pictures/leaderboards/monthly/${today.year}/${today.month}`;
  } else if (period === "yearly") {
    url = `/pictures/leaderboards/yearly/${today.year}`;
  } else {
    return data(null, { status: 400 });
  }
  return redirect(url);
}