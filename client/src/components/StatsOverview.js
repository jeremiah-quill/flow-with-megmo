import React from "react";

// TODO: where should this data come from?  Where should it be converted into the below details?
function StatsOverview({completedClasses}) {
	return (
		<div className="stats-overview">
			<div className="total-classes">{completedClasses.length} classes</div>
            {/* <div className="unique-students">60 unique students</div> */}
            <div className="gross-income">$2,000</div>
		</div>
	);
}

export default StatsOverview;
