package com.d.hrwork.rest;

import java.util.List;


import org.apache.commons.httpclient.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.d.hrwork.model.Leave;
import com.d.hrwork.model.LeaveStatus;
import com.d.hrwork.response.ResponseWrapper;
import com.d.hrwork.service.LeaveService;

@RestController
@RequestMapping("/leave")
public class LeaveController {
	@Autowired
	private LeaveService leaveService;

	private Logger LOG = LoggerFactory
			.getLogger(AuthenticationController.class);

	@RequestMapping(value = "/first", method = RequestMethod.GET)
	public String firstinit() {

		return "rest web service hit successfully";
	}

	/*
	 * To Apply Leave For Particular User
	 */
	@RequestMapping(value = "/applyleave", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
	public Object applyLeave(@RequestBody Leave leave) {
		ResponseWrapper wrp = new ResponseWrapper();
		LOG.debug("To Apply for Leave");
		try {
			if (leave == null) {

				wrp.setResponseCode(org.apache.commons.httpclient.HttpStatus.SC_NOT_FOUND);
				wrp.setResponseError("Leave Apply failed");
				wrp.setResult(leave);
				return wrp;

			}
			leave = leaveService.applyLeave(leave);
			wrp.setResponseCode(HttpStatus.SC_OK);
			wrp.setResponseSuccess("You have Applied for Leave successfully!");
			wrp.setResult(leave);

			return wrp;
		} catch (Exception e) {
			LOG.error("Error while signing in:", e);
			wrp.setResponseCode(org.apache.commons.httpclient.HttpStatus.SC_INTERNAL_SERVER_ERROR);
			wrp.setResponseError("Internal service error occured while Applying Leave, please try again!");
			return wrp;
		}
	}

	/*
	 * List of leave taken by the all employee(visible for manager alone)
	 */
	@RequestMapping(value = "/listOfLeave", method = RequestMethod.GET)
	public ResponseWrapper listleave() {

		List<Leave> leavelist = leaveService.listOfleave();
		System.out.println("List of leave are" + leavelist);

		ResponseWrapper response = new ResponseWrapper();
		LOG.debug("To List All Leave");
		try {
			if (leavelist == null) {
				response.setResponseCode(org.apache.commons.httpclient.HttpStatus.SC_NOT_FOUND);
				response.setResponseError("Leaves are not exist,plz try once again!");
				response.setResult(leavelist);
				return response;
			}

			response.setResponseCode(HttpStatus.SC_OK);
			response.setResponseSuccess("You have Listed the Leave!");
			response.setResult(leavelist);
			return response;

		} catch (Exception e) {
			LOG.error("Error while Listing users:", e);
			response.setResponseCode(org.apache.commons.httpclient.HttpStatus.SC_INTERNAL_SERVER_ERROR);
			response.setResponseError("Internal service error occured while Listing Leave, please try again!");
			return response;
		}

	}

	/*
	 * To list the no of Leave taken by user OR Leaves taken by user
	 */

	@RequestMapping(value = "/LeavesForuser", method = RequestMethod.GET)
	public ResponseWrapper LeavesForuser(@RequestParam("id") Long id) {

		List<Leave> leaveListForUser = leaveService.noOfLeaves(id);
		System.out.println("List of leaves for User are" + leaveListForUser);

		ResponseWrapper response = new ResponseWrapper();
		LOG.debug("To List All Leave for particular user");
		try {
			if (leaveListForUser == null) {
				response.setResponseCode(org.apache.commons.httpclient.HttpStatus.SC_NOT_FOUND);
				response.setResponseError("Leaves are not exist,plz try once again!");
				response.setResult(leaveListForUser);
				return response;
			}

			response.setResponseCode(HttpStatus.SC_OK);
			response.setResponseSuccess("You have Listed the Leave!");
			response.setResult(leaveListForUser);
			return response;

		} catch (Exception e) {
			LOG.error("Error while Listing users:", e);
			response.setResponseCode(org.apache.commons.httpclient.HttpStatus.SC_INTERNAL_SERVER_ERROR);
			response.setResponseError("Internal service error occured while Listing Leave, please try again!");
			return response;
		}

	}

	/*
	 * To Get the Particular Leave Details of User. BY giving Leave Id as input.
	 */
	@RequestMapping(value = "/getLeaveDetails", method = RequestMethod.GET)
	public Object findLeaveById(@RequestParam("id") Long id) {

		Leave leaveDetails = leaveService.findLeavebyId(id);

		ResponseWrapper response = new ResponseWrapper();
		LOG.debug("To Get the Particular Leave Details");
		try {
			if (leaveDetails == null) {
				response.setResponseCode(org.apache.commons.httpclient.HttpStatus.SC_NOT_FOUND);
				response.setResponseError("Leaves  Deatils are not exist,plz try once again!");
				response.setResult(leaveDetails);
				return response;
			}
			System.out.println(" Id \t" + leaveDetails.getId());
			System.out.println("NumberOfDays\t "
					+ leaveDetails.getNumberOfDays());
			System.out.println("Status\t " + leaveDetails.getStatus());
			// System.out.println("ApprovedBy \t" +
			// leaveDetails.getApprovedBy());
			/*
			 * System.out.println("CreatedBy \t" +
			 * leaveDetails.getCreatedBy().getUserName());
			 * System.out.println("Or"); System.out.println("CreatedBy \t" +
			 * leaveDetails.getCreatedBy().getId());
			 */System.out.println("CreatedOn \t" + leaveDetails.getCreateOn());
			System.out.println("LeaveFromDate\t "
					+ leaveDetails.getLeaveFromDate());
			System.out
					.println("LeaveToDate \t" + leaveDetails.getLeaveToDate());
			System.out.println("LeaveFor\t "
					+ leaveDetails.getLeaveFor().getUserName());
			System.out.println("Or");
			System.out.println("LeaveFor \t"
					+ leaveDetails.getLeaveFor().getId());

			response.setResponseCode(HttpStatus.SC_OK);
			response.setResponseSuccess("You have  Get the leave Deatils!");
			response.setResult(leaveDetails);
			return response;

		} catch (Exception e) {
			LOG.error("Error while get Leave Details:", e);
			response.setResponseCode(org.apache.commons.httpclient.HttpStatus.SC_INTERNAL_SERVER_ERROR);
			response.setResponseError("Internal service error occured while Getting Leave Deatils , please try again!");
			return response;
		}
	}

	/*
	 * to approve leave for particular user by higher Authority.
	 */

	@RequestMapping(value = "/leavestatus", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
	public Object approveLeave(@RequestBody Leave leave) {

		System.out.println(leave.getStatus());
		System.out.println(leave.getId());
		ResponseWrapper response = new ResponseWrapper();

		try {
			if (leave.getId() == null) {
				response.setResponseCode(org.apache.commons.httpclient.HttpStatus.SC_NOT_FOUND);
				response.setResponseError(" You Did not Approve the Leave ,plz try once again!");
				return response;
			} else if (leave.getId() != null
					&& leave.getStatus() == LeaveStatus.APPROVED) {
				leaveService.approveLeave(leave);
				response.setResponseCode(HttpStatus.SC_OK);
				response.setResponseSuccess("Leave Approved  !");
				response.setResult(leave);
				return response;
			} else if (leave.getId() != null
					&& leave.getStatus() == LeaveStatus.REJECTED) {
				System.out.println("status of leave to REJECTED"
						+ leave.getStatus());
				leaveService.cancelLeave(leave);
				response.setResponseCode(HttpStatus.SC_OK);
				response.setResponseSuccess("Leave rejected!");
				response.setResult(leave);
				return response;
			} else if (leave.getId() != null
					&& leave.getStatus() == LeaveStatus.CANCEL) {
				System.out.println("status of leave to CANCEL"
						+ leave.getStatus());
				leaveService.cancelLeave(leave);
				response.setResponseCode(HttpStatus.SC_OK);
				response.setResponseSuccess("Leave CANCELED");
				response.setResult(leave);
				return response;
			}
			return response;
		} catch (Exception e) {
			LOG.error("Error while Approve/Reject Leave:", e);
			response.setResponseCode(org.apache.commons.httpclient.HttpStatus.SC_INTERNAL_SERVER_ERROR);
			response.setResponseError("Internal service error occured while Approving/rejecting Leave Deatils , please try again!");
			return response;
		}
	}

	/*
	 * DeleteLeave means manager Can delete the leave of particular
	 * Employee(or)User.
	 */
	@RequestMapping(value = "/deleteLeave", method = RequestMethod.GET)
	public ResponseWrapper deleteLeave(@RequestParam("id") Long id) {
		ResponseWrapper response = new ResponseWrapper();
		LOG.debug("To Delete Leave");

		try {

			int result = leaveService.deleteLeave(id);

			if (result != 0) {
				response.setResponseCode(HttpStatus.SC_OK);
				response.setResponseSuccess("User DELETED  successfully!");
				return response;
			}
			response.setResponseCode(org.apache.commons.httpclient.HttpStatus.SC_NOT_FOUND);
			response.setResponseError("No User Found in Database!");

			return response;

		}

		catch (Exception e) {
			LOG.error("Error while Delete User in Db:", e);
			response.setResponseCode(org.apache.commons.httpclient.HttpStatus.SC_INTERNAL_SERVER_ERROR);
			response.setResponseError("Internal service error occured while Deleteing User, please try again!");
			return response;
		}

	}

	@RequestMapping(value = "/updateleave", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
	public ResponseWrapper updateLeave(@RequestBody Leave leave) {
		ResponseWrapper wrapper = new ResponseWrapper();
		LOG.debug("To Update Leave For User");
		try {

			Leave result = leaveService.updateLeave(leave);

			if (result == null) {
				wrapper.setResponseCode(org.apache.commons.httpclient.HttpStatus.SC_NOT_FOUND);
				wrapper.setResponseError("Leave not updated successfully,plz try once again!");
				wrapper.setResult(result);
				return wrapper;
			}

			wrapper.setResponseCode(HttpStatus.SC_OK);
			wrapper.setResponseSuccess("Your Leave has Been Updated.!");
			wrapper.setResult(result);
			return wrapper;

		} catch (Exception e) {
			LOG.error("Error while creating user:", e);
			wrapper.setResponseCode(org.apache.commons.httpclient.HttpStatus.SC_INTERNAL_SERVER_ERROR);
			wrapper.setResponseError("Internal service error occured while Updating leave Details, please try again!");
			return wrapper;
		}
	}

	/*
	 * TO get the Leaves Based on Month and Year.
	 */

	@RequestMapping(value = "/leavelistByMonth", method = RequestMethod.POST,consumes = "application/json", produces = "application/json")
	public ResponseWrapper leavelistByMonth(@RequestBody Leave user) {

		List<Leave> leavelistByMonth = leaveService.leavelistByMonth(user);
		System.out.println("leave list By Month  are" + leavelistByMonth);

		ResponseWrapper response = new ResponseWrapper();
		LOG.debug("leave list By Month");
		try {
			if (leavelistByMonth == null) {
				response.setResponseCode(org.apache.commons.httpclient.HttpStatus.SC_NOT_FOUND);
				response.setResponseError("Ther in no Leaves taken by Employee or users");
				return response;
			}
			response.setResponseCode(HttpStatus.SC_OK);
			response.setResponseSuccess("You have Listed the Leave!");
			response.setResult(leavelistByMonth);
			return response;

		} catch (Exception e) {
			LOG.error("Error while Listing users:", e);
			response.setResponseCode(org.apache.commons.httpclient.HttpStatus.SC_INTERNAL_SERVER_ERROR);
			response.setResponseError("Internal service error occured while Listing Leave, please try again!");
			return response;
		}

	}

}
