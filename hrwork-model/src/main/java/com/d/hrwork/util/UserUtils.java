//package com.d.hrwork.util;
//
//import java.util.ArrayList;
//import java.util.List;
//
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.userdetails.UserDetails;
//
//public class UserUtils {
//	public static List<String> userdetails() {
//		
//	        
//		UserDetails userDetails = (UserDetails) SecurityContextHolder
//				.getContext().getAuthentication().getPrincipal();
//		//System.err.println("User id : "+ userDetails.getId());
//		System.err.println("role MMM: " + userDetails.getAuthorities());
//		System.err.println("Password PPP: " + userDetails.getPassword());
//		System.err.println("USERname :" + userDetails.getUsername());
//		System.err.println("active :" + userDetails.isEnabled());
//
//		List<String> list = new ArrayList<String>();
//		list.add(userDetails.getUsername());
//		list.add(userDetails.getPassword());
//		boolean is = userDetails.isEnabled();
//		String str;
//		if (is == true)
//			str = "true";
//		else
//			str = "false";
//		list.add(str);
//		list.add(userDetails.getAuthorities().toString());
//		return list;
//
//	}
//}
