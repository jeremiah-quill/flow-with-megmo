import { useState } from "react";
import {
	QUERY_UPCOMING_STUDENT_CLASSES,
	QUERY_COMPLETED_STUDENT_CLASSES,
} from "../../utils/queries";
import { useQuery, useMutation } from "@apollo/client";
import { useUserContext } from "../../utils/contexts/UserContext";
import { useToastContext } from "../../utils/contexts/ToastContext";
import RegisteredClassList from "../lists/RegisteredClassList";
import CompletedClassList from "../lists/CompletedClassList";
import {
	REMOVE_CLASS_FROM_STUDENT,
	REMOVE_FROM_ROSTER,
} from "../../utils/mutations";
import "../../styles/LoggedInHome.css";
import { useModalContext } from "../../utils/contexts/ModalContext";
import { sendEmail } from "../../utils/API";
import {unregisterMsg} from '../../utils/emailMessages.js'

function StudentProfile() {
	// toggle between list of registered and completed classes
	const [listView, setListView] = useState("registered");

	// get user, modal, and toast contexts
	const { currentUser } = useUserContext();
	const { resetModal } = useModalContext();
	const { configureToast } = useToastContext();

	// Query upcoming student classes
	// fetchPolicy set to network only so it re-fetches from db every render, rather than use cache
	const {
		loading: upcomingLoading,
		data: upcomingData,
		error: upcomingError,
	} = useQuery(QUERY_UPCOMING_STUDENT_CLASSES, {
		variables: { studentId: currentUser._id },
		fetchPolicy: "network-only",
	});
	const studentUpcomingClasses = upcomingData?.getUpcomingStudentClasses || [];

	// Query completed student classes
	// fetchPolicy set to network only so it re-fetches from db every render, rather than use cache
	const {
		loading: completedLoading,
		data: completedData,
		error: completedError,
	} = useQuery(QUERY_COMPLETED_STUDENT_CLASSES, {
		variables: { studentId: currentUser._id },
		fetchPolicy: "network-only",
	});
	const studentCompletedClasses =
		completedData?.getCompletedStudentClasses || [];

	// Mutation to remove a student from class roster when they cancel registration
	const [removeFromRoster, { error: removeStudentError }] =
		useMutation(REMOVE_FROM_ROSTER);

	// Mutation to remove a class from student's registered classes field when they cancel registration
	// refetchQueries set to query upcoming classes -> whenever we run this mutation to cancel a class, we will also re-run get upcoming student classes to refresh the list
	const [removeClassFromStudent, { error: removeClassFromStudentError }] =
		useMutation(REMOVE_CLASS_FROM_STUDENT, {
			refetchQueries: [
				QUERY_UPCOMING_STUDENT_CLASSES,
				"getUpcomingStudentClasses",
			],
		});

	// Fires 2 mutations, 1 to class and 1 to student on unregister confirmation
	// Closes modal and sends user a toast message with success or error
	const handleUnregister = async (classId, studentId, classDetails) => {
		const {dayOfWeek, month, dayOfMonth, hour} = classDetails
		try {
			const { data: removeFromRosterData } = await removeFromRoster({
				variables: { classId, studentId },
			});
			const { data: removeClassFromStudentData } = await removeClassFromStudent(
				{
					variables: { studentId, classId },
				}
			);

			// Send email to user confirming their cancellation
			const emailData = {
				toEmail: currentUser.email,
				subject: `Unregistered from class on ${dayOfWeek}, ${month}/${dayOfMonth} @ ${hour}`,
				message: unregisterMsg(classDetails)
			};
			const emailResponse = await sendEmail(emailData);

			resetModal();

			configureToast(
				"You have been successfully removed from class.",
				"success",
				5000
			);
		} catch (err) {
			console.error(err);
			configureToast(
				"Something went wrong, please email us at flowwithmegmo@gmail.com",
				"failure",
				10000
			);
		}
	};

	// TODO: can I condense this?
	if (upcomingLoading) return <div className="view">Loading</div>;
	if (upcomingError)
		return <div className="view">Error! {upcomingError.message}</div>;
	if (completedLoading) return <div className="view">Loading</div>;
	if (completedError)
		return <div className="view">Error! {completedError.message}</div>;
	if (removeStudentError)
		return <div className="view">Error! ${removeStudentError.message}</div>;
	if (removeClassFromStudentError)
		return (
			<div className="view">Error! ${removeClassFromStudentError.message}</div>
		);

	return (
		<div className="logged-in-home view">
			<div className="student-info">
				<h2 className="logged-in-header">Welcome {currentUser.username}!</h2>
				<p>
					Here you'll be able to manage any classes you have registered for.
					<br></br>
					<br></br>
					Also check out my music! After we finish a class I will post the
					playlist I used. Check it out in the completed classes section.
				</p>
			</div>
			<div className="student-lists-container">
				<div className="student-list-buttons">
					<button
						className={`list-btn ${
							listView === "registered" ? "selected-list" : ""
						}`}
						onClick={() => setListView("registered")}
					>
						Registered
					</button>
					<button
						className={`list-btn ${
							listView === "completed" ? "selected-list" : ""
						}`}
						onClick={() => setListView("completed")}
					>
						Completed
					</button>
				</div>
				{listView === "registered" ? (
					<RegisteredClassList
						registeredClasses={studentUpcomingClasses}
						handleUnregister={handleUnregister}
					/>
				) : (
					<CompletedClassList completedClasses={studentCompletedClasses} />
				)}
			</div>
		</div>
	);
}

export default StudentProfile;
