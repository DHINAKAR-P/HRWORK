package com.d.hrwork.rest;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.httpclient.HttpStatus;
import org.json.JSONException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.d.hrwork.model.User;
import com.d.hrwork.response.ResponseWrapper;
import com.d.hrwork.service.LoginService;
import com.d.hrwork.service.hrworkObjectConverter;
import com.d.hrwork.service.impl.UserServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;


@RestController
@RequestMapping("/login")
public class AuthenticationController {

	@Autowired
	private LoginService loginService;

	@Autowired
	private hrworkObjectConverter objectconverter;

	private Logger LOG = LoggerFactory.getLogger(AuthenticationController.class);

	@SuppressWarnings("unused")
	private String[] userObjectJson = { "id", "firstName", "lastName", "userName", "dateOfBirth", "resume", "role.storedSnapshot.*", "password", "skills.storedSnapshot.*",
			"status", "contact.id", "contact.address", "contact.photoUrl", "contact.phone.storedSnapshot.*", "contact.emailAddress.storedSnapshot.*", "manager" };

	@RequestMapping(value = "/first", method = RequestMethod.GET)
	public String firstinit() {

		return "rest web service hit successfully";
	}

 

	@RequestMapping(value = "/checkuserName", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
	public Object checkUserName(@RequestBody String userName) {
		ResponseWrapper wrp = new ResponseWrapper();
		User use = loginService.findByUserName(userName);
		if (use == null) {
			wrp.setResponseCode(HttpStatus.SC_OK);
			wrp.setResponseSuccess("user name is valid!");
			return wrp;
		} else {
			wrp.setResponseError("UserName already exist!!Plz signUp with different UserName");
			return wrp;
		}
	}

	@RequestMapping(value = "/signup", method = RequestMethod.POST)
	@ResponseBody
	public Object signUp(@RequestParam(value="user", required=false) String userObject, @RequestParam("file") MultipartFile file) throws IOException,JSONException {
		ResponseWrapper wrp = new ResponseWrapper();

		System.out.println("user object--&**(*&%*&^%$#*&^%$*&^%-____----------" + userObject);
		System.out.println("file name--------------" + file.getName());

		System.out.println("original file name-----" + file.getOriginalFilename());

		System.out.println("type+-----------------" + file.getContentType());

		System.out.println("size--------------------" + file.getSize());
		User userz = new ObjectMapper().readValue(userObject, User.class);
		System.out.println(userz.getDateOfBirth());
		System.out.println(userz.getSkills().toString());
		System.out.println(userz.getRole().toString());
		System.out.println(userz.getContact().getEmailAddress().toString());
		System.out.println(userz.getContact().getPhone().toString());
		System.out.println(userz.getSkills());

		LOG.debug("To do Sign Up");
		
		try {
			if (userz == null) {

				wrp.setResponseCode(org.apache.commons.httpclient.HttpStatus.SC_NOT_FOUND);
				wrp.setResponseError("SignUp failed");
				return wrp;
			}
			User u=loginService.datastore(file, userz);
			wrp.setResponseCode(HttpStatus.SC_OK);
			wrp.setResponseSuccess("You have Signed in successfully!");
			wrp.setResult(u);
			return wrp;

		} catch (Exception e) {
			LOG.error("Error while signing in:", e);
			wrp.setResponseCode(org.apache.commons.httpclient.HttpStatus.SC_INTERNAL_SERVER_ERROR);
			wrp.setResponseError("Internal service error occured while signing in, please try again!");
			return wrp;

		}

	}
//IT WILL WORKS ON MZ-FIRWFOX OLY ---NOT YET COMPLETED
	@RequestMapping(value = "/download", method = RequestMethod.GET)
	@ResponseBody
	public byte[] dowload() throws SQLException, IOException {
		byte[] b = loginService.download();
		return b;
	}

 
	@RequestMapping(value = "/resetPassword", method = RequestMethod.GET)
	public Object resetPassword(@RequestParam("oldpassword") String oldpassword, @RequestParam("password") String password, @RequestParam("id") Long id) {
		ResponseWrapper wrp = new ResponseWrapper();
		LOG.debug("To do resetPassword");
		try {
			if (password == null && oldpassword == null) {

				wrp.setResponseCode(org.apache.commons.httpclient.HttpStatus.SC_NOT_FOUND);
				wrp.setResponseError("Password not created");
				return wrp;

			}
			int user = loginService.resetPassword(oldpassword, password, id);
			wrp.setResponseCode(HttpStatus.SC_OK);
			wrp.setResponseSuccess("Password changed  successfully!");
			wrp.setResult(user);

			return wrp;
		} catch (Exception e) {
			LOG.error("Error while changing in:", e);
			wrp.setResponseCode(org.apache.commons.httpclient.HttpStatus.SC_INTERNAL_SERVER_ERROR);
			wrp.setResponseError("Internal service error occured while changing password, please try again!");
			return wrp;

		}

	}

	/**
	 * to spring security...
	 */
	@RequestMapping(value = "/default/", method = RequestMethod.GET)
	public String defaultAfterLogin(HttpServletRequest request) {
		// HR, ADMIN, MANAGER, EMPLOYEE, CONTRACTOR

		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		System.out.println(userDetails.getAuthorities());
		System.out.println(userDetails.getPassword());
		System.out.println(userDetails.getUsername());
		System.out.println(userDetails.isEnabled());

		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		String role = auth.getAuthorities().toString();
		System.out.println("Spring security context details:\n" + "Role:" + role + "" + "username" + auth.getName() + "" + auth.getPrincipal());

		if (request.isUserInRole("ROLE_HR")) {
			System.out.println("Role HR works");
			System.out.println("username " + request.getUserPrincipal().getName());
			return "ROLE_HR";
			// return "redirect:/events/";
		} else if (request.isUserInRole("ROLE_ADMIN")) {
			System.out.println("Role ADMIN works");
			System.out.println("username " + request.getUserPrincipal().getName());
			return "ROLE_ADMIN";
			// return "redirect:/events/";
		} else if (request.isUserInRole("ROLE_MANAGER")) {
			System.out.println("Role MANAGER works");
			System.out.println("username " + request.getUserPrincipal().getName());
			return "ROLE_MANAGER";
			// return "redirect:/events/";
		} else if (request.isUserInRole("ROLE_EMPLOYEE")) {
			System.out.println("Role EMPLOYEE works");
			System.out.println("username " + request.getUserPrincipal().getName());
			return "ROLE_EMPLOYEE";
			// return "redirect:/events/";
		} else if (request.isUserInRole("ROLE_CONTRACTOR")) {
			System.out.println("Role CONTRACTOR works");
			System.out.println("username " + request.getUserPrincipal().getName());
			return "ROLE_CONTRACTOR";
			// return "redirect:/leave/applyleave/";
		} else {
			return "redirect:/";
		}
	}

	@Autowired
	UserServiceImpl userserviceimpl;

	@RequestMapping(value = "/loginSuccess/", method = RequestMethod.GET)
	public @ResponseBody Map<String, Object> success(HttpServletRequest request) throws IllegalArgumentException, IllegalAccessException {
		System.out.println("Login success controller called");
		Map<String, Object> response = new HashMap<String, Object>();

		/** Spring security context holder to get user details from this context */

		/**
		 * Authentication auth =
		 * SecurityContextHolder.getContext().getAuthentication(); String role =
		 * auth.getAuthorities().toString();
		 * System.out.println("Spring security context details:\n" + "Role:"+
		 * role + "" + "username" + auth.getName());
		 */

		// List<String> dto_list=UserUtils.userdetails();
		// System.out.println("&&&&  &&&");
		// System.out.println("username :"+dto_list.get(0));
		// System.out.println("password"+dto_list.get(1));
		// System.out.println("is enabled :"+dto_list.get(2));
		// // System.out.println("authority :"+dto_list.get(3));
		// System.out.println("&&&&  &&&");
		response.put("status", "success");
		// response.put("userName", request.getUserPrincipal().getName());
		System.out.println("in -----------------------------------------------login sucess");
		response.put("userdetails", userserviceimpl.findByUserName(request.getUserPrincipal().getName()));
		return response;
	}

	@RequestMapping(value = "/loginFailure/", method = RequestMethod.GET)
	public @ResponseBody Map<String, Object> failure() {
		System.out.println("Login failure controller called");
		Map<String, Object> response = new HashMap<String, Object>();
		response.put("status", "failed");
		return response;
	}

	@RequestMapping(value = "/accessDenied/", method = RequestMethod.GET)
	public @ResponseBody Map<String, Object> accessDenied() {
		System.out.println("Access denied controller called");
		Map<String, Object> response = new HashMap<String, Object>();
		response.put("status", "Access Denied");
		return response;
	}

	@RequestMapping(value = "/noUserPrincipalFound/", method = RequestMethod.GET)
	public @ResponseBody Map<String, Object> sessionNotFound() {
		System.out.println("No user principal controller called");
		System.out.println("No principal found. Redirect the page to login");
		Map<String, Object> response = new HashMap<String, Object>();
		response.put("status", "No User principal Found. Redirect to login");
		return response;
	}

	@RequestMapping(value = "/invalidateSession/", method = RequestMethod.GET)
	public @ResponseBody Map<String, Object> invalidateSession() {
		System.out.println("Login invalidate session method called");
		Map<String, Object> response = new HashMap<String, Object>();
		response.put("status", "invalidatesession");
		return response;
	}

	@RequestMapping(value = "/sessionExpiry/", method = RequestMethod.GET)
	public @ResponseBody Map<String, Object> sessionExpiry() {
		System.out.println("Login session expiry method called");
		Map<String, Object> response = new HashMap<String, Object>();
		response.put("status", "sessionexpiry");
		return response;
	}

	@RequestMapping(value = "/welcome", method = RequestMethod.GET)
	public Object welcomePage(@RequestHeader("JSESSIONID") String sessionId) {
		System.out.println("&*&*&*&*&*&*&*&**&*&*&*&*&*&*&*&*");
		System.out.println("session ID = " + sessionId);
		/*
		 * ModelAndView model = new ModelAndView(); model.addObject("title",
		 * "Spring Security Custom Login Form"); model.addObject("message",
		 * "This is welcome page!"); model.setViewName("login"); return model;
		 */
		return "login success =>" + sessionId;
	}

}
