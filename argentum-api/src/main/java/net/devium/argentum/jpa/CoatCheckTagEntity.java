package net.devium.argentum.jpa;

import javax.persistence.*;
import java.util.Date;
import java.util.Objects;

@Entity
@Table(name = "coat_check_tags")
public class CoatCheckTagEntity {
    @Id
    private long id;

    private Date time;

    @ManyToOne
    @JoinColumn(name = "guest_id")
    private GuestEntity guest;

    public CoatCheckTagEntity() {
    }

    // Create & update.
    public CoatCheckTagEntity(long id, Date time, GuestEntity guest) {
        this.id = id;
        this.time = time;
        this.guest = guest;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }

    public GuestEntity getGuest() {
        return guest;
    }

    public void setGuest(GuestEntity guest) {
        this.guest = guest;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CoatCheckTagEntity that = (CoatCheckTagEntity) o;
        return id == that.id;
    }

    @Override
    public int hashCode() {

        return Objects.hash(id);
    }
}
