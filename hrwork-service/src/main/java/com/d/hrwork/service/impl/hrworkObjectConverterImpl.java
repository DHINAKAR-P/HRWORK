package com.d.hrwork.service.impl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import com.d.hrwork.service.hrworkObjectConverter;
import flexjson.JSONSerializer;

@Service
public class hrworkObjectConverterImpl implements hrworkObjectConverter  {	

		private JSONSerializer serializer;

		@Transactional(propagation = Propagation.REQUIRES_NEW)
		
		public String serializeAll(String[] includes, Object obj) {
			if (serializer == null) {
				serializer = new JSONSerializer();
			}
			return serializer.include(includes).exclude("*").serialize(obj);
		}

	}
	
	
