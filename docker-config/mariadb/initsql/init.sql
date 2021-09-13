CREATE DATABASE IF NOT EXISTS Accounts;

USE Accounts;

-- Closure Table

DROP TABLE IF EXISTS Departments;
CREATE TABLE Departments (
    dep_id      SERIAL  NOT NULL  PRIMARY KEY,
    dep_name    VARCHAR(20) NOT NULL
);

DROP TABLE IF EXISTS DepartmentPaths;
CREATE TABLE DepartmentPaths (
    ancestor    BIGINT  UNSIGNED    NOT NULL,
    descendant  BIGINT  UNSIGNED    NOT NULL,
    PRIMARY KEY(ancestor, descendant),
    FOREIGN KEY(ancestor) REFERENCES Departments(dep_id),
    FOREIGN KEY(descendant) REFERENCES Departments(dep_id)
);

INSERT INTO Departments(dep_id, dep_name) VALUES (1, "해군"),(2, "군수사령부"),(3, "사령부본부"),(4, "정비창"),(5, "보급창");
INSERT INTO Departments(dep_id, dep_name) VALUES (6, "정보통신전대"),(7, "계획과"),(8, "체계지원과"),(9, "체계정비과"),(10, "정보보호과"),(11, "통신운용대");

INSERT INTO DepartmentPaths VALUES (1,1),(1,2),(2,2),(2,3),(2,4),(2,5),(2,6),(3,3),(4,4),(5,5),(6,6),(6,7),(6,8),(6,9),(6,10),(6,11);
INSERT INTO DepartmentPaths VALUES (7,7),(8,8),(9,9),(10,10),(11,11);