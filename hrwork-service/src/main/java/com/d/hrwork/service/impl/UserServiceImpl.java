package com.d.hrwork.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.d.hrwork.dao.UserDao;
import com.d.hrwork.model.Contact;
import com.d.hrwork.model.User;
import com.d.hrwork.service.UserService;

@Service
@Transactional
public class UserServiceImpl implements UserService {

	@Autowired
	UserDao userDao;

	@Transactional
	public int deleteUser(Long id) {

		return userDao.deleteUser(id);
	}

	public List<User> listOfUser() {

		return userDao.listOfUser();
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.d.hrwork.service.UserService#updateUser(com.d.hrwork.model.User)
	 * 
	 * TO Update the user with contact.
	 */
	@Transactional
	public User updateUser(User user) {

		User fetchobj = userDao.findById(user);
		user.setManager(fetchobj);
		System.out.println("user id from table " + fetchobj.getId());

		user.getContact().setId(fetchobj.getContact().getId());

		System.out.println(" poooored  user obj contact  value id " + user.getContact().getId());

		System.out.println("contact in array" + user.getContact());
		System.out.println("set value of u objt address   " + user.getContact().getAddress());
		System.out.println("set value of u objt photoUrl  " + user.getContact().getPhotoUrl());
		System.out.println("set value of u objt Email Address " + user.getContact().getEmailAddress());
		System.out.println("set value of u objt phone  " + user.getContact().getPhone());

		return userDao.updateUser(user);
	}

	public int userActivate(User user) {

		return userDao.userActivate(user);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.d.hrwork.service.UserService#updateUserContact(com.d.hrwork.model
	 * .User)
	 * 
	 * To update particular user's Contact details alone.
	 */

	public Contact updateUserContact(User u) {
		Contact c = new Contact();

		User user = userDao.findById(u);
		c.setId(user.getContact().getId());
		c.setAddress(u.getContact().getAddress());
		c.setPhone(u.getContact().getPhone());
		c.setEmailAddress(u.getContact().getEmailAddress());
		c.setPhotoUrl(u.getContact().getPhotoUrl());

		System.out.println("contact id in contact update class" + c.getId());
		System.out.println("contact mailid in contact update class" + c.getEmailAddress());
		System.out.println("contact phone in contact update class" + c.getPhone());
		System.out.println("contact id phurl contact update class" + c.getPhotoUrl());

		return userDao.updateUserContact(c);
	}

	public User findById(Long id) {

		return userDao.findUserById(id);
	}

	public User findByPassword(String password) {

		return userDao.findByPassword(password);
	}

	public User findByUserName(String userName) {

		return userDao.findByUserName(userName);
	}
}
