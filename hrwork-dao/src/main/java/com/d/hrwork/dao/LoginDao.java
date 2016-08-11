package com.d.hrwork.dao;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.d.hrwork.model.User;
import com.d.hrwork.repository.UserRepository;
import com.mysql.jdbc.Blob;

@Repository
public class LoginDao {

	@Autowired
	UserRepository userRepository;

	// @org.springframework.data.annotation.Transient
	@Transactional
	public User SaveUser(User user) {

		return userRepository.save(user);

	}

	public User doLogin(User user) {

		System.out.println("in dao" + user.getUserName());
		System.out.println("in dao password" + user.getPassword().toUpperCase());
		return userRepository.doLogin(user.getUserName(), user.getPassword());
	}

	public int resetPassword(String oldpassword, String password, Long id) {

		return userRepository.resetPassword(oldpassword, password, id);
	}

	public User findByUserName(String userName) {

		return userRepository.findByUserName(userName);
	}

	public User datastore(MultipartFile file, User userString) throws IOException {
		userString.setResume(file.getBytes());
		userString.setManager(userString);

		return userRepository.save(userString);

	}

	/* TO DOWNLOAD A FILE OR IMAGE IN FUTURE */
	public byte[] getdownload() {
		long id = 14;
		User user = userRepository.findResume(id);
		System.out.println("user name-----------------------------------------" + user.getFirstName());
		byte[] b = user.getResume();
		return b;

	}

}
