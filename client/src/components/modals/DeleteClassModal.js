import React from "react";
import { zoomDelete } from "../../utils/API";
import { useMutation, useQuery } from "@apollo/client";
import { DELETE_CLASS } from "../../utils/mutations";
// TODO: create this query
import { QUERY_STUDENTS } from "../../utils/queries";


function DeleteClassModal({ scheduledClass }) {
	const [deleteClass] = useMutation(DELETE_CLASS);

	const handleDelete = async (zoomId, classId) => {
		// TODO: query all students in this class and get their eamils.  send them each an email telling them class is cancelled
		//	
		//
		//

		// TODO: error handling
		try {
			const meetingId = { meetingId: zoomId };
			const deleteResponse = await zoomDelete(meetingId);
			console.log(deleteResponse);
		} catch (err) {
			console.error(err);
		}

		// Cancel class in db
		// TODO: error handling
		try {
			const { data } = await deleteClass({
				variables: { classId },
			});
			console.log(data);
			// TODO: allow teacher to customize this cancellation message
			// let roster = data.deleteClass.roster

			// console.log(
			// 	`Send email to ${roster} with message from Meghan that class is cancelled`
			// );
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div>
			{/* <div className="modal-card"> */}
			<header className="modal-header">
				{scheduledClass.date} @ {scheduledClass.time}
			</header>
			<div className="modal-content">
				Please confirm you would like to delete this class. All users who have
				signed up will receive an email notification.
			</div>
			<div className="modal-footer">
				<button
					onClick={() =>
						handleDelete(scheduledClass.zoomId, scheduledClass._id)
					}
				>
					Confirm
				</button>
			</div>
			{/* </div> */}
		</div>
	);
}

export default DeleteClassModal;
