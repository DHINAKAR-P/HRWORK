package com.d.hrwork.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.d.hrwork.model.Contact;
import com.d.hrwork.model.User;
import com.d.hrwork.repository.UserContactRepository;
import com.d.hrwork.repository.UserRepository;

@Repository
public class UserDao {

	@Autowired
	UserRepository userRepository;
	@Autowired
	UserContactRepository contctRepository;

	@Autowired
	UserContactRepository userContactRepository;

	@Transactional
	public int deleteUser(Long id) {

		return userRepository.deleteById(id);

	}

	public List<User> listOfUser() {
		return userRepository.findAll();
	}

	@Transactional
	public User updateUser(User user) {

		System.out.println("id" + user.getId());
		System.out.println("firstName" + user.getFirstName());
		System.out.println("lastName" + user.getLastName());
		System.out.println("status" + user.getStatus());
		System.out.println("DOB" + user.getDateOfBirth());
		System.out.println("contact" + user.getContact());
		System.out.println("password" + user.getPassword());
		System.out.println("skilss" + user.getSkills());
		System.out.println("resume" + user.getResume());
		System.out.println("role" + user.getRole());// DHINA
		// System.out.println("manager"+user.getManager());
		System.out.println("Username" + user.getUserName());
		// System.out.println("LeavTaken"+user.getLeaveTaken());

		return userRepository.saveAndFlush(user);
	}

	public int userActivate(User user) {

		return userRepository.userActivate(user.getId(), user.getStatus());
	}

	@Transactional
	public Contact updateUserContact(Contact u) {
		System.out.println("id in dao" + u.getId());

		return userContactRepository.saveAndFlush(u);// userContactRepository.updateUserContact(contact.getId(),contact.getAddress(),contact.getPhone(),contact.getPhotoUrl(),contact.getEmailAddress());

	}

	public User findById(User user) {
		return userRepository.findById(user.getId());
	}

	public User findUserById(Long id)
	{
		return userRepository.findById(id);
	}

	
	public User findByPassword(String password) {
	
		return userRepository.findByPassword(password);
	}

	public User findByUserName(String userName) { 
		
		return userRepository.findByUserName(userName);
	}
	
	
}
