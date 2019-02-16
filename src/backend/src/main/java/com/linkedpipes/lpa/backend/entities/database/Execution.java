package com.linkedpipes.lpa.backend.entities.database;

import java.io.Serializable;
import javax.persistence.*;
import java.util.Date;

@Entity(name="execution")
public class Execution implements Serializable {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String executionIri;

    @Column(nullable = false)
    private Date started;

    @ManyToOne
    private User user;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;

        if (!user.getExecutions().contains(this)) {
            user.getExecutions().add(this);
        }
    }

    public void setExecutionStarted(String executionIri, Date started) {
        this.executionIri = executionIri;
        this.started = started;
    }

    public String getExecutionIri() {
        return executionIri;
    }

    public Date getDateStarted() {
        return started;
    }

    public long getId() {
        return id;
    }
}
