package net.devium.argentum.jpa;

import javax.persistence.*;

@Entity
@Table(name = "statuses")
public class StatusEntity {
    @Id
    @GeneratedValue
    private long id;

    private String internalName;
    private String displayName;
    private String color;

    public StatusEntity() {
    }

    public StatusEntity(String internalName, String displayName, String color) {
        this.internalName = internalName;
        this.displayName = displayName;
        this.color = color;
    }

    public StatusEntity(long id, String internalName, String displayName, String color) {
        this.id = id;
        this.internalName = internalName;
        this.displayName = displayName;
        this.color = color;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getInternalName() {
        return internalName;
    }

    public void setInternalName(String internalName) {
        this.internalName = internalName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        StatusEntity that = (StatusEntity) o;

        return id == that.id;
    }

    @Override
    public int hashCode() {
        return (int) (id ^ (id >>> 32));
    }
}
