import React from "react";
import { useModalContext } from "../../utils/contexts/ModalContext";
import CancelRegistrationModal from "../modals/CancelRegistrationModal";
import ClassDetails from "../ClassDetails";
import "../../styles/ClassCard.css";

function RegisteredClassList({ registeredClasses, handleUnregister }) {
	const { configureModal } = useModalContext();
	return (
		<ul className="student-lists class-list">
			{registeredClasses.map((registeredClass) => (
				<div key={registeredClass._id} className="class-list-item">
					<ClassDetails date={registeredClass.date} />
					<div className="class-status">Registered</div>
					<div className="class-actions">
						<button
							className="btn btn-round btn-pink"
							onClick={() =>
								configureModal(
									<CancelRegistrationModal
										date={registeredClass.date}
										classId={registeredClass._id}
										handleUnregister={handleUnregister}
									/>
								)
							}
						>
							Cancel
						</button>
					</div>
				</div>
			))}
		</ul>
	);
}

export default RegisteredClassList;
