DROP TABLE `user_agents`
;
CREATE TABLE `user_agents` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `agent_name` varchar(40) NOT NULL,
  `agent_age` varchar(10) NOT NULL,
  `url` varchar(512) DEFAULT NULL,
  `age` varchar(40) DEFAULT NULL,
  `age_score` varchar(40) DEFAULT NULL,
  `gender` varchar(40) DEFAULT NULL,
  `gender_score` varchar(40) DEFAULT NULL,
  `message1` varchar(120) DEFAULT NULL,
  `message2` varchar(120) DEFAULT NULL,
  `message3` varchar(120) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `agent_name` (`agent_name`)
) ENGINE=InnoDB AUTO_INCREMENT=145 DEFAULT CHARSET=utf8;

DROP TABLE `employees`
;
CREATE TABLE `employees` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `agent_name` varchar(40) NOT NULL,
  `email` varchar(120) DEFAULT NULL,
  `name` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `agent_name` (`agent_name`)
) ENGINE=InnoDB AUTO_INCREMENT=145 DEFAULT CHARSET=utf8;
