package com.d.hrwork.service;

import java.util.List;

import com.d.hrwork.model.Contact;
import com.d.hrwork.model.User;

public interface UserService {

	public int deleteUser(Long id);

	public List<User> listOfUser();

	public User updateUser(User user);
	
	public int userActivate(User user);
	
	public User findById( Long id);
	
	public User findByPassword(String emailAddress);
	
	public Contact updateUserContact(User user);
}
