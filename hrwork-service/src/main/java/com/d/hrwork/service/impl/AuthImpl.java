package com.d.hrwork.service.impl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.d.hrwork.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class AuthImpl implements UserDetailsService {
	@Autowired
	private UserRepository userRepository;

	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		System.out.println("we are in spring security");
		System.out.println("role user" + username);
		int role_value = 0;
		com.d.hrwork.model.User domainUser = userRepository.findByUsername_security(username);
		System.out.println("Size of the object is--------------------------------------------------------------------------------- " + domainUser);
		ObjectMapper mapper = new ObjectMapper();
		try {
			mapper.writeValueAsString(domainUser);
		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		System.err.println("get user current id " + domainUser.getId());
		System.err.println("username is " + domainUser.getUserName());
		System.err.println("password is " + domainUser.getPassword());
		// System.err.println("The role value is &&^^^^RR### "+domainUser.getRole().name());
		// String str = domainUser.getRole().name().toString();
		/*
		 * System.err.println("The role value is &&^^^^RR### "+domainUser.getRole
		 * ().toString());
		 */String str = domainUser.getRole().toString();
		System.out.println("role $$$$ " + str);
		System.out.println("role $$$$ " + domainUser.getRole().toString());
		// DHINA

		// String str="ADMIN";
		// HR, ADMIN, MANAGER, EMPLOYEE, CONTRACTOR
		if (str.equals("HR")) {
			role_value = 0;
			System.err.println("$----------------------------------------rftghjk0------------------------------------HR");
		} else if (str.equals("ADMIN")) {
			role_value = 1;
			System.err.println("admin **&UYUYUYUYU");
		} else if (str.equals("MANAGER")) {
			role_value = 2;
			System.err.println("manager NJHJHJ&^&^");
		} else if (str.equals("EMPLOYEE")) {
			role_value = 3;
			System.err.println("employee JKJKJKJ^&^&^");
		} else if (str.equals("CONTRACTOR")) {
			System.err.println("contractor ^&^&^&JKJKJK54545NBB&");
			role_value = 4;
		}

		org.springframework.security.core.userdetails.User userNew = new org.springframework.security.core.userdetails.User(domainUser.getUserName(), domainUser.getPassword(),
				getAuthorities(role_value));
		return userNew;
	}

	public Collection<? extends GrantedAuthority> getAuthorities(Integer role) {
		List<GrantedAuthority> authList = getGrantedAuthorities(getRoles(role));
		return authList;
	}

	// HR, ADMIN, MANAGER, EMPLOYEE, CONTRACTOR
	public List<String> getRoles(Integer role) {
		List<String> roles = new ArrayList<String>();
		if (role.intValue() == 0) {
			roles.add("ROLE_HR");
		} else if (role.intValue() == 1) {
			roles.add("ROLE_ADMIN");
		}
		if (role.intValue() == 2) {
			roles.add("ROLE_MANAGER");
		} else if (role.intValue() == 3) {
			roles.add("ROLE_EMPLOYEE");
		} else if (role.intValue() == 4) {
			roles.add("ROLE_CONTRACTOR");
		}

		return roles;
	}

	public static List<GrantedAuthority> getGrantedAuthorities(List<String> roles) {
		List<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
		for (String role : roles) {
			authorities.add(new SimpleGrantedAuthority(role));
		}
		return authorities;
	}

}
